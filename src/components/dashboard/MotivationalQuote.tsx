
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

const quotes = [
  {
    text: "It's not about having time, it's about making time.",
    author: "Unknown"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "Productivity is being able to do things that you were never able to do before.",
    author: "Franz Kafka"
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
    author: "Stephen King"
  },
  {
    text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    author: "Steve Jobs"
  },
  {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe"
  },
  {
    text: "If you spend too much time thinking about a thing, you'll never get it done.",
    author: "Bruce Lee"
  }
];

const gradientStyles = [
  "from-masterplan-purple/20 to-masterplan-teal/15",
  "from-masterplan-amber/20 to-masterplan-coral/15",
  "from-blue-400/20 to-masterplan-purple/15",
  "from-masterplan-teal/20 to-masterplan-green/15"
];

export const MotivationalQuote: React.FC = () => {
  const [quote, setQuote] = useState(quotes[0]);
  const [gradientIndex, setGradientIndex] = useState(0);

  useEffect(() => {
    // Get a random quote on initial render
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
    
    // Random gradient
    setGradientIndex(Math.floor(Math.random() * gradientStyles.length));
    
    // Update quote every few minutes
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[newIndex]);
      setGradientIndex(Math.floor(Math.random() * gradientStyles.length));
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`dashboard-card h-full bg-gradient-to-br ${gradientStyles[gradientIndex]} animated-bg border border-purple-200/30`}>
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <Quote className="h-8 w-8 text-masterplan-purple opacity-50 mb-4" />
            <Star className="h-5 w-5 text-masterplan-amber opacity-50" />
          </div>
          <blockquote className="text-lg font-medium italic mb-4 gradient-text-warm">
            "{quote.text}"
          </blockquote>
        </div>
        <footer className="text-right text-sm text-muted-foreground">
          — {quote.author}
        </footer>
      </CardContent>
    </Card>
  );
};
