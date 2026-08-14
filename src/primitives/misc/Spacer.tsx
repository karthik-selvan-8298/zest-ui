import * as React from 'react';

/** Flexible gap filler for Flex/Stack rows (flex: 1). */
export function Spacer(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden style={{ flex: 1, alignSelf: 'stretch' }} {...props} />;
}
