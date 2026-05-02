import { Link } from "react-router-dom";
import { tmdb } from "@/services/tmdb";

interface PersonCardProps {
  person: {
    id: number;
    name: string;
    profile_path: string | null;
    character?: string;
    job?: string;
  };
}

const PersonCard = ({ person }: PersonCardProps) => (
  <Link
    to={`/person/${person.id}`}
    className="group block flex-shrink-0 w-32 text-center"
  >
    <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-muted shadow-card mb-2">
      <img
        src={tmdb.image.profile(person.profile_path, "w185")}
        alt={person.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
      />
    </div>
    <p className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">{person.name}</p>
    {(person.character || person.job) && (
      <p className="text-xs text-muted-foreground line-clamp-1">{person.character || person.job}</p>
    )}
  </Link>
);

export default PersonCard;
