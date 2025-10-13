import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';

const PaperboySection = () => {
  const [country, setCountry] = useState('');
  const [query, setQuery] = useState('');
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
  ];

  const handleGenerateNewspaper = async () => {
    if (!country || !query) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock articles data
    const mockArticles = [
      {
        id: 1,
        title: `Breaking: ${query} developments in ${country.toUpperCase()}`,
        summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        timestamp: '2 hours ago',
        source: 'News Source 1'
      },
      {
        id: 2,
        title: `Analysis: ${query} impact on global markets`,
        summary: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        timestamp: '4 hours ago',
        source: 'News Source 2'
      },
      {
        id: 3,
        title: `Opinion: The future of ${query}`,
        summary: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        timestamp: '6 hours ago',
        source: 'News Source 3'
      }
    ];
    
    setArticles(mockArticles);
    setIsLoading(false);
  };

  return (
    <div className="h-full bg-paperboy-black flex flex-col p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-paperboy-white mb-2">Paperboy</h1>
        <p className="text-paperboy-white/70">Generate your personalized newspaper</p>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        <div>
          <Label className="text-paperboy-white mb-2 block">Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="bg-paperboy-black border-input-border text-paperboy-white">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent className="bg-paperboy-black border-input-border">
              {countries.map((c) => (
                <SelectItem key={c.value} value={c.value} className="text-paperboy-white hover:bg-paperboy-red/20">
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-paperboy-white mb-2 block">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="paperboy-outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange ? format(dateRange, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-paperboy-black border-input-border">
              <Calendar
                mode="single"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
                className="bg-paperboy-black text-paperboy-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="text-paperboy-white mb-2 block">Search Query</Label>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What news are you looking for?"
            className="bg-paperboy-black border-input-border text-paperboy-white placeholder:text-paperboy-white/50"
          />
        </div>

        <Button
          onClick={handleGenerateNewspaper}
          variant="paperboy"
          className="w-full"
          disabled={!country || !query || isLoading}
        >
          {isLoading ? (
            <>
              <Search className="mr-2 h-4 w-4 animate-spin" />
              Generating Newspaper...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Generate Newspaper
            </>
          )}
        </Button>
      </div>

      {/* Articles Output */}
      {articles.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xl font-semibold text-paperboy-white mb-4">Your Newspaper</h2>
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="bg-paperboy-dark-bg border border-paperboy-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-paperboy-white mb-2">{article.title}</h3>
                <p className="text-paperboy-white/70 mb-3">{article.summary}</p>
                <div className="flex justify-between items-center text-sm text-paperboy-white/50">
                  <span>{article.source}</span>
                  <span>{article.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperboySection;