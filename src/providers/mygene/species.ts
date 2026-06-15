// species lookup table
interface SpeciesInfo {
  common: string;
  genus: string;
  icon: string;
  ideogramName?: string;
}

export const speciesMap: Record<number, SpeciesInfo> = {
  9606: { common: "Human", genus: "Homo sapiens", icon: "🧑", ideogramName: "human" },
  10090: { common: "Mouse", genus: "Mus musculus", icon: "🐭", ideogramName: "mouse" },
  10116: { common: "Rat", genus: "Rattus norvegicus", icon: "🐀", ideogramName: "rattus-norvegicus" },
  7227: { common: "Fruitfly", genus: "Drosophila melanogaster", icon: "🪰", ideogramName: "drosophila-melanogaster" },
  6239: { common: "Nematode", genus: "Caenorhabditis elegans", icon: "🪱", ideogramName: "caenorhabditis-elegans" },
  7955: { common: "Zebrafish", genus: "Danio rerio", icon: "🐟", ideogramName: "danio-rerio" },
  3702: { common: "Thale cress", genus: "Arabidopsis thaliana", icon: "🌱", ideogramName: "arabidopsis-thaliana" },
  8364: { common: "Frog", genus: "Xenopus tropicalis", icon: "🐸", ideogramName: "xenopus-tropicalis" },
  9823: { common: "Pig", genus: "Sus scrofa", icon: "🐖", ideogramName: "sus-scrofa" },
  559292 : { common: "Yeast", genus: "Saccharomyces cerevisiae", icon: "🧫", ideogramName: "saccharomyces-cerevisiae" },
};

/**
 * Finds species data by either taxid or common name (case-insensitive).
 * @param identifier - The taxid (number) or common name (string).
 * @returns An object with the taxid and the SpeciesInfo, or null if not found.
 */
export function findSpecies(identifier: string | number | undefined): { taxid: number; info: SpeciesInfo } | null {
  if (identifier === undefined || identifier === null) return null;

  const identifierStr = String(identifier).toLowerCase();
  
  // First, try to match by taxid if it's a number
  if (typeof identifier === 'number' && speciesMap[identifier]) {
    return { taxid: identifier, info: speciesMap[identifier] };
  }

  // Otherwise, search by common name or taxid string
  for (const taxidStr in speciesMap) {
    const taxid = parseInt(taxidStr, 10);
    const info = speciesMap[taxid];
    
    // Check taxid string match OR common name match
    if (identifierStr === taxidStr || identifierStr === info.common.toLowerCase()) {
      return { taxid, info };
    }
  }

  return null;
}