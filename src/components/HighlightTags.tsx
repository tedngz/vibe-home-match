import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HighlightTagsProps {
  highlights: string[];
  maxWords?: number;
}

export const HighlightTags = ({ highlights, maxWords = 4 }: HighlightTagsProps) => {
  const [showAll, setShowAll] = useState(false);
  
  // Limit each highlight to maximum words
  const processedHighlights = highlights.map(highlight => {
    const words = highlight.trim().split(/\s+/);
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return highlight;
  });

  const displayedHighlights = showAll ? processedHighlights : processedHighlights.slice(0, 3);
  const hasMore = processedHighlights.length > 3;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {displayedHighlights.map((highlight, index) => (
          <Badge 
            key={index} 
            variant="outline" 
            className="text-xs bg-white/50 max-w-full"
          >
            <span className="truncate">{highlight}</span>
          </Badge>
        ))}
        
        {!showAll && hasMore && (
          <Badge 
            variant="outline" 
            className="text-xs bg-white/50 cursor-pointer hover:bg-white/70"
            onClick={() => setShowAll(true)}
          >
            +{processedHighlights.length - 3} more
          </Badge>
        )}
      </div>
      
      {showAll && hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto text-orange-600 hover:text-orange-700"
          onClick={() => setShowAll(false)}
        >
          <ChevronUp className="w-3 h-3 mr-1" />
          Show less
        </Button>
      )}
    </div>
  );
};