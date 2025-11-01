'use client';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
      </div>
      <span>Someone is typing...</span>
    </div>
  );
}
