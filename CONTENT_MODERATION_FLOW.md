# Content Moderation Flow - Complete Guide

## 🛡️ Overview

PodLink now has a **2-layer content moderation system**:
1. **Pre-Send Validation** - Blocks offensive messages BEFORE they're sent
2. **Post-Report Moderation** - Auto-deletes reported offensive messages

---

## 🔄 Complete Flow

### Flow 1: User Sends Message (Pre-Send Validation)

```
┌─────────────────────────────────────────┐
│  User Types Message                     │
│  "hey nigga what's up"                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  User Clicks Send                       │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Frontend: POST /api/pods/messages      │
│  Body: { messageText, podId, userId }   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Backend: validateMessage(text)         │
│  → containsOffensiveContent()           │
└─────────────────┬───────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
    🤖 AI Check      📋 Fallback Check
    (OpenRouter)     (Keyword Patterns)
         │                 │
         └────────┬────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
    ✅ Clean         🚫 Offensive
         │                 │
         │                 ▼
         │        ┌─────────────────────┐
         │        │ Return 400 Error     │
         │        │ "Contains racial     │
         │        │  slur (critical)"    │
         │        └─────────────────────┘
         │                 │
         │                 ▼
         │        ❌ Message NOT Saved
         │        ❌ User sees error
         │        ❌ Message BLOCKED
         │
         ▼
┌─────────────────────────────────────────┐
│  Save Message to Database               │
│  ✅ message.messageText = "hey what's up"│
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Emit via Socket.IO to Pod              │
│  ✅ Other users see the message         │
└─────────────────────────────────────────┘
```

---

### Flow 2: User Reports Message (Post-Report Moderation)

```
┌─────────────────────────────────────────┐
│  Bad Message Already in Chat            │
│  (somehow got through - old message,    │
│   API key issue, etc.)                  │
│  "fuck this shit nigga"                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Another User Clicks "Report Message"   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Frontend: POST /api/pods/messages/     │
│  report                                 │
│  Body: { messageId, reason }            │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Backend: Create MessageReport          │
│  status: 'PENDING'                      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Backend: moderateReportedMessage()     │
│  → containsOffensiveContent()           │
└─────────────────┬───────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
    🤖 AI Check      📋 Fallback Check
    (OpenRouter)     (Keyword Patterns)
         │                 │
         └────────┬────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
    ✅ Clean         🚫 Offensive
         │                 │
         │                 ▼
         │        ┌─────────────────────┐
         │        │ shouldDelete: true   │
         │        │ reason: "Contains    │
         │        │  racial slur"        │
         │        └─────────┬───────────┘
         │                  │
         │                  ▼
         │        ┌─────────────────────┐
         │        │ UPDATE podMessage    │
         │        │ SET isDeleted=true   │
         │        │ deletedReason=...    │
         │        └─────────┬───────────┘
         │                  │
         │                  ▼
         │        ┌─────────────────────┐
         │        │ UPDATE report        │
         │        │ status='ACTION_TAKEN'│
         │        └─────────┬───────────┘
         │                  │
         │                  ▼
         │        ✅ Message AUTO-DELETED
         │        ✅ Report marked handled
         │
         ▼
┌─────────────────────────────────────────┐
│  Mark report as 'REVIEWED'              │
│  No action needed                       │
└─────────────────────────────────────────┘
```

---

## 🤖 AI Moderation (Primary Method)

### OpenRouter API Call
```typescript
{
  model: 'google/gemini-2.0-flash-exp:free',
  messages: [
    {
      role: 'system',
      content: `You are a STRICT content moderator.
      
      FLAG THESE AS OFFENSIVE:
      1. Racial slurs (nigga, nigger, negro, chink, etc.) - CRITICAL
      2. Profanity (fuck, shit, bitch, etc.)
      3. Hate speech (religion, gender, sexuality)
      4. Sexual content
      5. Threats/violence
      6. Harassment/bullying
      
      BE VERY STRICT with racial slurs - ALWAYS flag them.`
    },
    {
      role: 'user',
      content: 'Analyze this message: "hey nigga"'
    }
  ],
  temperature: 0.1  // Low = consistent, strict moderation
}
```

### AI Response
```json
{
  "isOffensive": true,
  "reason": "Contains racial slur",
  "severity": "critical"
}
```

---

## 📋 Fallback Moderation (When AI Unavailable)

### Keyword Patterns
```typescript
const offensivePatterns = [
  // CRITICAL - Racial Slurs (always block)
  { pattern: /\bnigga\b/i, reason: 'racial slur', critical: true },
  { pattern: /\bnigger\b/i, reason: 'racial slur', critical: true },
  { pattern: /\bnigro\b/i, reason: 'racial slur', critical: true },
  { pattern: /\bnegro\b/i, reason: 'racial slur', critical: true },
  { pattern: /\bchink\b/i, reason: 'racial slur', critical: true },
  { pattern: /\bspic\b/i, reason: 'racial slur', critical: true },
  
  // Profanity
  { pattern: /\bfuck\b/i, reason: 'profanity' },
  { pattern: /\bshit\b/i, reason: 'profanity' },
  { pattern: /\bbitch\b/i, reason: 'profanity' },
  
  // Homophobic
  { pattern: /\bfaggot\b/i, reason: 'homophobic slur', critical: true },
  { pattern: /\bfag\b/i, reason: 'homophobic slur', critical: true },
  
  // ... more patterns
];
```

### Pattern Matching
```typescript
for (const { pattern, reason, critical } of offensivePatterns) {
  if (pattern.test(normalizedText)) {
    return {
      isOffensive: true,
      reason: reason,
      matches: [critical ? 'critical' : 'profanity']
    };
  }
}
```

---

## 🎯 What Happens to Different Words

| Word/Phrase | AI Detection | Fallback Detection | Result |
|-------------|--------------|-------------------|--------|
| **"nigga"** | ✅ BLOCKED | ✅ BLOCKED | 🚫 **CANNOT SEND** |
| **"nigger"** | ✅ BLOCKED | ✅ BLOCKED | 🚫 **CANNOT SEND** |
| **"fuck"** | ✅ BLOCKED | ✅ BLOCKED | 🚫 **CANNOT SEND** |
| **"shit"** | ✅ BLOCKED | ✅ BLOCKED | 🚫 **CANNOT SEND** |
| **"bitch"** | ✅ BLOCKED | ✅ BLOCKED | 🚫 **CANNOT SEND** |
| **"faggot"** | ✅ BLOCKED | ✅ BLOCKED | 🚫 **CANNOT SEND** |
| **"damn"** | ⚠️ Maybe | ❌ Allowed | ⚠️ **AI Decides** |
| **"hello"** | ✅ Allowed | ✅ Allowed | ✅ **SENT** |

---

## 🔍 Detection Methods

### 1. AI Moderation (Primary)
- **Provider**: OpenRouter API
- **Model**: google/gemini-2.0-flash-exp:free
- **Temperature**: 0.1 (strict, consistent)
- **Max Tokens**: 150
- **Advantages**:
  - Context-aware (understands "shoot" vs "shoot you")
  - Detects variations (n1gga, n!gger, etc.)
  - Multilingual support
  - Understands intent

### 2. Fallback Moderation (Backup)
- **Method**: Regex pattern matching
- **Patterns**: 20+ offensive word patterns
- **Advantages**:
  - Works offline
  - Fast (<1ms)
  - Zero API cost
  - Guaranteed detection of known words

---

## 📊 Severity Levels

| Severity | Examples | Action |
|----------|----------|--------|
| **CRITICAL** | Racial slurs, homophobic slurs | Immediate block/delete |
| **HIGH** | Explicit threats, sexual content | Block/delete |
| **MEDIUM** | Harsh profanity, bullying | Block/delete |
| **LOW** | Mild profanity | Block/delete |

---

## 🧪 Testing Examples

### Test 1: Sending Message with "nigga"
```
User types: "hey nigga what's up"
              ↓
validateMessage() called
              ↓
AI detects: "Contains racial slur (critical)"
              ↓
Returns: { isValid: false, error: "Contains racial slur..." }
              ↓
Backend returns: 400 Bad Request
              ↓
User sees: "Your message contains inappropriate content and cannot be sent"
              ↓
Message is NOT saved to database ❌
```

### Test 2: Reporting Message with "fuck"
```
Message in chat: "fuck this"
              ↓
User clicks "Report Message"
              ↓
POST /api/pods/messages/report
              ↓
moderateReportedMessage() called
              ↓
AI detects: "Contains profanity (high)"
              ↓
shouldDelete: true
              ↓
UPDATE podMessage SET isDeleted=true
              ↓
Message automatically deleted ✅
              ↓
Other users no longer see it
```

### Test 3: Clean Message
```
User types: "Good morning everyone!"
              ↓
validateMessage() called
              ↓
AI checks: No offensive content
              ↓
Returns: { isValid: true }
              ↓
Message saved to database ✅
              ↓
Emitted to pod via Socket.IO ✅
              ↓
Other users see the message ✅
```

---

## 🛠️ Developer Tools

### Enable Detailed Logging
In development mode, you'll see:
```
🔍 Content Moderation Result:
  text: "hey nigga"
  isOffensive: true
  reason: "Contains racial slur"
  severity: "critical"

🚫 Message BLOCKED before sending:
  reason: "Contains racial slur (critical)"
  severity: "critical"

🗑️  Reported message AUTO-DELETED:
  reason: "Contains profanity"
  severity: "high"

🚨 Fallback moderation detected:
  reason: "Contains racial slur (critical)"
  critical: true
  pattern: /\bnigga\b/i
```

---

## 📁 Files Involved

### 1. **Content Moderation Logic**
- `src/lib/content-moderation.ts`
  - `containsOffensiveContent()` - AI + fallback detection
  - `validateMessage()` - Pre-send validation
  - `moderateReportedMessage()` - Post-report auto-delete
  - `fallbackModeration()` - Keyword patterns

### 2. **API Routes**
- `src/app/api/pods/messages/route.ts` (POST)
  - Calls `validateMessage()` before saving
  - Blocks offensive messages with 400 error
  
- `src/app/api/pods/messages/report/route.ts` (POST)
  - Creates report
  - Calls `moderateReportedMessage()`
  - Auto-deletes if offensive

### 3. **Database Schema**
```prisma
model PodMessage {
  id            String   @id
  messageText   String
  isDeleted     Boolean  @default(false)
  deletedReason String?
  reports       MessageReport[]
}

model MessageReport {
  id          String   @id
  messageId   String
  reportedBy  String
  reason      String
  status      String   // PENDING, ACTION_TAKEN, REVIEWED
  message     PodMessage @relation(fields: [messageId])
}
```

---

## ✅ Current Status

| Feature | Status | Details |
|---------|--------|---------|
| **Pre-Send Validation** | ✅ Active | Blocks offensive messages BEFORE sending |
| **AI Moderation** | ✅ Active | OpenRouter API (primary) |
| **Fallback Moderation** | ✅ Active | Keyword patterns (backup) |
| **Post-Report Delete** | ✅ Active | Auto-deletes reported offensive content |
| **Racial Slur Detection** | ✅ Strict | "nigga", "nigger", etc. always blocked |
| **Profanity Detection** | ✅ Active | Common profanity blocked |
| **Hate Speech Detection** | ✅ Active | Homophobic, racist content blocked |
| **Development Logging** | ✅ Active | Detailed console logs |

---

## 🎯 Summary

### For Regular Messages:
1. User types message
2. **Validation runs BEFORE saving**
3. If offensive → **BLOCKED (400 error)**
4. If clean → Saved and sent ✅

### For Reported Messages:
1. User reports message
2. **AI checks the content**
3. If offensive → **AUTO-DELETED**
4. If clean → Marked as reviewed

### Key Points:
- ✅ **"nigga" is ALWAYS blocked** (AI + fallback)
- ✅ **Messages are validated BEFORE sending**
- ✅ **Reported messages are AUTO-DELETED if offensive**
- ✅ **Both AI and keyword detection active**
- ✅ **Zero tolerance for racial slurs**

---

**Result**: Your app now has **bulletproof content moderation** with 2-layer protection! 🛡️
