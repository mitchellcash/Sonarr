import React from 'react';
import Link from 'Components/Link/Link';
import TableRowCell from './TableRowCell';

function TableRowCellButton(props) {
  return (
    <Link
      component={TableRowCell}
      {...props}
    />
  );
}

export default TableRowCellButton;
