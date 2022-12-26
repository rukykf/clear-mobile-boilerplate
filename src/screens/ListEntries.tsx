import React, { Suspense, useEffect } from "react";
import { ActivityIndicator, Text } from "react-native";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { OperationType } from "relay-runtime";

const ListEntriesQuery = graphql`
  query ListEntriesQuery {
    getEntries{
      entryId,
      createdAt,
      base64Image
    }
  }
`;

// This component should ideally display a list of previous photo entries from the user
// Currently doesn't work
export default function ListEntries(): JSX.Element {
  const [queryReference, loadQuery] = useQueryLoader(ListEntriesQuery);
  useEffect(
    () => loadQuery({ entryId: "f3d69a7e-9e4c-4e3e-ac68-28c16bb1c599" }),
    [loadQuery]
  );

  return queryReference ? (
    <Suspense fallback={<ActivityIndicator />}>
      <HomeContent queryReference={queryReference} />
    </Suspense>
  ) : (
    <ActivityIndicator />
  );
}

function HomeContent({
  queryReference,
}: {
  queryReference: PreloadedQuery<OperationType, Record<string, unknown>>;
}): JSX.Element {
  const data = usePreloadedQuery(ListEntriesQuery, queryReference);

  // For some reason, react relay can't seem to retrieve the base64 Image with this query
  // When I try this out with shorter / smaller sized strings, it's able to get the data
  // And proceed with rendering. With the images, it's just loading forever.
  return <Text>{JSON.stringify(data)}</Text>;
}
