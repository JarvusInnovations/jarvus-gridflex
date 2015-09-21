/**
 * Enables flex values for column widths in modern grids
 *
 * TODO:
 * - Try to set initial width earlier so that there isn't a flash of unsized columns between paint and the first resize event
 * - Move to standalone package
 */
Ext.define('Jarvus.plugin.GridFlex', {
    extend: 'Ext.Component',
    alias: 'plugin.gridflex',

    config: {
        grid: null
    },

    init: function(grid) {
        this.setGrid(grid);
    },

    updateGrid: function(grid, oldGrid) {
        if (oldGrid) {
            oldGrid.un('resize', 'onGridResize', this);
            grid.container.show();
        }

        if (grid) {
            grid.on('resize', 'onGridResize', this);
            grid.container.hide();
        }
    },

    onGridResize: function(gridEl, resizeInfo) {
        this.flexColumnsToWidth(resizeInfo.width);
    },

    flexColumnsToWidth: function(availableWidth) {
        var flexColumns = [],
            flexTotal = 0,
            grid = this.getGrid(),
            columns = grid.getColumns(),
            columnsLen, columnIndex, column, columnFlex;

        for (columnIndex = 0, columnsLen = columns.length; columnIndex < columnsLen; columnIndex++) {
            column = columns[columnIndex];
            columnFlex = column.getFlex();

            if (columnFlex) {
                flexColumns.push(column);
                flexTotal += columnFlex;
            } else {
                availableWidth -= column.getWidth();
            }
        }

        for (columnIndex = 0, columnsLen = flexColumns.length; columnIndex < columnsLen; columnIndex++) {
            column = flexColumns[columnIndex];
            column.setWidth(availableWidth * (column.getFlex() / flexTotal));
        }

        grid.container.show();
    }
});
