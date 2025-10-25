import { Search } from "lucide-react";

interface EmptyStateProps {
  query?: string;
}

const EmptyState = ({ query }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-primary" />
      </div>
      {query ? (
        <>
          <h3 className="text-2xl font-semibold mb-2 text-foreground">No Results Found</h3>
          <p className="text-muted-foreground max-w-md">
            We couldn't find any movies matching "{query}". Try adjusting your search terms.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-semibold mb-2 text-foreground">Start Your Search</h3>
          <p className="text-muted-foreground max-w-md">
            Search for your favorite movies, series, or episodes using the search bar above.
          </p>
        </>
      )}
    </div>
  );
};

export default EmptyState;
