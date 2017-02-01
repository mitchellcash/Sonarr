import React from 'react';
import { Grid } from 'react-virtualized';

class VirtualTableBody extends Grid {

  //
  // Control

  cellRenderer({ rowIndex, style, ...rest }) {
    const { rowRenderer } = this.props;

    // By default, List cells should be 100% width.
    // This prevents them from flowing under a scrollbar (if present).
    style.width = '100%';

    return rowRenderer({
      index: rowIndex,
      style,
      ...rest
    });
  }

  //
  // Render


}

export default VirtualTableBody;
