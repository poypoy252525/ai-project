import { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import type { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot, User, Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: Message;
  onRetry?: () => void;
  className?: string;
}

const LoadingDots = memo(() => (
  <div className="flex items-center space-x-1 h-8">
    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
  </div>
));

LoadingDots.displayName = "LoadingDots";

const MessageBubble = memo<MessageBubbleProps>(
  ({ message, onRetry, className }) => {
    const isUser = message.role === "user";
    const isLoading = message.isLoading;

    const handleCopy = async () => {
      if (!message.content || isLoading) return;
      try {
        await navigator.clipboard.writeText(message.content);
      } catch (err) {
        console.error("Failed to copy message:", err);
      }
    };

    if (isUser) {
      // User message layout - aligned to the right
      return (
        <div className={cn("group w-full flex justify-end", className)}>
          <div className="flex gap-3 px-3 py-2 sm:px-6 max-w-[80%] sm:max-w-[70%]">
            {/* Message Content */}
            <div className="space-y-2 overflow-hidden w-full">
              {/* Images */}
              {message.images && message.images.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-end">
                  {message.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt={image.name}
                      className="max-w-full max-h-48 object-cover rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(image.url, "_blank")}
                      title={`Click to view ${image.name} in full size`}
                    />
                  ))}
                </div>
              )}

              {/* Text Content */}
              {message.content && (
                <div className="bg-muted text-foreground rounded-2xl px-4 py-3 w-fit ml-auto max-w-full">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={handleCopy}
                  disabled={!message.content}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
            </div>

            {/* Avatar */}
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-muted text-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      );
    }

    // Assistant message layout - aligned to the left
    return (
      <div className={cn("group w-full", className)}>
        <div className="flex gap-3 sm:gap-4 px-3 py-3 sm:px-6 max-w-[95%] sm:max-w-[85%]">
          {/* Avatar */}
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-muted text-muted-foreground">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>

          {/* Message Content */}
          <div className="flex-1 space-y-2 overflow-hidden">
            {isLoading ? (
              <LoadingDots />
            ) : (
              <MarkdownRenderer content={message.content} />
            )}

            {/* Action buttons */}
            {!isLoading && (
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={handleCopy}
                  disabled={!message.content}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>

                {onRetry && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={onRetry}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";

export { MessageBubble };
