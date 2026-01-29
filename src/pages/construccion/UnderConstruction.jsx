import PageBySlug from "../../router/PageBySlug";
import UnderConstructionTemplate from "./UnderConstructionTemplate";

export default function UnderConstruction() {
  return (
    <PageBySlug
      forcedSlug="en-construccion"
      render={page => <UnderConstructionTemplate page={page} />}
    />
  );
}