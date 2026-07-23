import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LocationFilter({ defaultValue }: { defaultValue?: string }) {
  return (
    <form className="flex gap-2">
      <Input
        name="location"
        placeholder="Filter by location (e.g. London)"
        defaultValue={defaultValue}
        className="max-w-xs"
      />
      <Button type="submit" variant="outline">
        Filter
      </Button>
    </form>
  );
}
