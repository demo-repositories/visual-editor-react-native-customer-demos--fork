import {
  SANITY_DATASET,
  SANITY_PROJECT_ID,
  SANITY_STUDIO_URL,
} from "@/constants";
import { stegaClean } from "@sanity/client/stega";
import {
  createDataAttribute,
  CreateDataAttributeProps,
} from "@sanity/visual-editing";
import { Platform } from "react-native";

export const isWeb = Platform.OS === "web";

// Your Sanity configuration
const config = {
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  baseUrl: SANITY_STUDIO_URL,
};

console.log("SANITY config", config);

export const createDataAttributeProp = (attr: CreateDataAttributeProps) => {
  if (isWeb) {
    const attribute = createDataAttribute({ ...config, ...attr })?.toString();
    if (attribute) {
      return { dataSet: { sanity: attribute } };
    }
  }
  return undefined;
};

// Wrap an `encodeDataAttribute(...)` result (from a useQuery result) into the
// React Native `dataSet` shape that enables click-to-edit overlays. Web only.
export const toSanityAttr = (attribute?: string) => {
  if (isWeb && attribute) {
    return { dataSet: { sanity: attribute } };
  }
  return undefined;
};

// Strip stega-encoded characters from values used for logic/navigation (route
// params, urlFor sources, Linking urls, dates, GROQ params). No-op off web.
export function clean<T>(value: T): T {
  try {
    return stegaClean(value) as T;
  } catch {
    return value;
  }
}
