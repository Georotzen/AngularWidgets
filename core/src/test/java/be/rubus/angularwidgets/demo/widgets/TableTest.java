package be.rubus.angularwidgets.demo.widgets;


import be.rubus.web.testing.annotation.Grafaces;
import be.rubus.web.testing.widget.extension.angularwidgets.PuiButton;
import be.rubus.web.testing.widget.extension.angularwidgets.PuiDatatable;
import be.rubus.web.testing.widget.extension.angularwidgets.PuiGrowl;
import be.rubus.web.testing.widget.extension.angularwidgets.PuiInputText;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.Keys;
import org.openqa.selenium.support.FindBy;

import java.util.List;

import static be.rubus.web.testing.widget.extension.angularwidgets.PuiDatatable.ColumnSortDirection;
import static org.junit.Assert.*;

/**
 *
 */
@RunWith(Arquillian.class)
public class TableTest extends AbstractWidgetTest {

    @Grafaces
    private PuiGrowl puiGrowl;

    // for the default demo
    @FindBy(id = "default")
    private PuiDatatable datatableDefault;

    // for the remote data demo
    @FindBy(id = "remoteData")
    private PuiDatatable datatableRemote;

    // for the columns demo
    @FindBy(id = "columns")
    private PuiDatatable datatableColumns;

    // for the sort and selection demo
    @FindBy(id = "sortSelection")
    private PuiDatatable datatableSortSelection;

    // for the paginator demo
    @FindBy(id = "paginator")
    private PuiDatatable datatablePaginator;

    // for the caption demo
    @FindBy(id = "caption")
    private PuiDatatable datatableCaptions;

    // for the multiselect demo
    @FindBy(id = "multi")
    private PuiDatatable datatableMulti;

    // For the programmatic selection demo
    @FindBy(id = "progRowSelect")
    private PuiDatatable datatableProgrammaticSelection;

    @FindBy(id = "rowIndex")
    private PuiInputText rowIdxInput;

    @FindBy(id = "selectBtn")
    private PuiButton selectButton;

    @FindBy(id = "unselectBtn")
    private PuiButton unselectBtn;

    // For the programmatic pagination demo

    @FindBy(id = "progPaginatorSelection")
    private PuiDatatable datatableProgrammaticPaginator;

    @FindBy(id = "newSelectedPage")
    private PuiInputText newPage;

    @FindBy(id = "setPage")
    private PuiButton gotoPageButton;

    @Override
    protected int getWidgetIdx() {
        return 2;
    }

    @Test
    @RunAsClient
    public void testOverview() {
        testWidgetOverviewPage("puiDatatable", "puiDatatable", 10);
    }


    @Test
    @RunAsClient
    public void testDefault() {
        showExample(1);
        assertEquals("Default integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        datatableDefault.isWidgetValid();

        assertEquals(4, datatableDefault.getColumnCount());
        assertEquals("brand", datatableDefault.getColumnHeader(0));
        assertEquals("vin", datatableDefault.getColumnHeader(3));
        assertFalse(datatableDefault.isSortable(0));

        assertEquals(10, datatableDefault.getRowCount());

        assertEquals("Volkswagen", datatableDefault.getCellValue(0, 0));
        assertEquals("h354htr", datatableDefault.getCellValue(2, 3));

        assertFalse(datatableDefault.hasPaginator());
    }

    @Test
    @RunAsClient
    public void testRemoteData() {
        showExample(2);
        assertEquals("Remote data", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        datatableRemote.isWidgetValid();

        assertEquals(4, datatableRemote.getColumnCount());
        assertEquals("vin", datatableRemote.getColumnHeader(0));
        assertEquals("color", datatableRemote.getColumnHeader(3));
        assertFalse(datatableRemote.isSortable(0));

        assertEquals(50, datatableRemote.getRowCount());

        assertEquals("15c538e7", datatableRemote.getCellValue(0, 0));
        assertEquals("Blue", datatableRemote.getCellValue(2, 3));
    }

    @Test
    @RunAsClient
    public void testColumns() {
        showExample(3);
        assertEquals("Specification of columns", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        datatableColumns.isWidgetValid();

        assertEquals(2, datatableColumns.getColumnCount());
        assertEquals("brand", datatableColumns.getColumnHeader(0));
        assertEquals("year", datatableColumns.getColumnHeader(1));
        assertFalse(datatableColumns.isSortable(0));

        assertEquals(10, datatableColumns.getRowCount());

        assertEquals("Volkswagen", datatableColumns.getCellValue(0, 0));
        assertEquals("2005", datatableColumns.getCellValue(2, 1));
    }

    @Test
    @RunAsClient
    public void testSortSelection() {
        showExample(4);
        assertEquals("Sorting of rows and selection", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        datatableSortSelection.isWidgetValid();

        assertEquals(3, datatableSortSelection.getColumnCount());
        assertEquals("brand", datatableSortSelection.getColumnHeader(0));
        assertEquals("year", datatableSortSelection.getColumnHeader(1));
        assertFalse(datatableSortSelection.isSortable(0));
        assertTrue(datatableSortSelection.isSortable(1));

        assertEquals(10, datatableSortSelection.getRowCount());

        assertEquals("Volkswagen", datatableSortSelection.getCellValue(0, 0));
        assertEquals("2005", datatableSortSelection.getCellValue(2, 1));

        assertEquals(ColumnSortDirection.NONE, datatableSortSelection.columnSortDirection(1));

        datatableSortSelection.clickHeader(1);
        assertEquals(ColumnSortDirection.UP, datatableSortSelection.columnSortDirection(1));

        assertEquals("1995", datatableSortSelection.getCellValue(0, 1));

        datatableSortSelection.clickRow(3);

        assertEquals(1, puiGrowl.getNumberOfMessages());
        assertEquals("Selected a Gray Renault of 2005 (id = h354htr)", puiGrowl.getMessageText(0));

        List<Integer> rowNumbers = datatableSortSelection.getSelectedRowNumber();
        assertEquals(1, rowNumbers.size());
        assertEquals(Integer.valueOf(3), rowNumbers.get(0));

        assertEquals("Renault", datatableSortSelection.getCellValue(3, 0));
        assertEquals("Gray", datatableSortSelection.getCellValue(3, 2));

        datatableSortSelection.clickHeader(1);
        assertEquals(ColumnSortDirection.DOWN, datatableSortSelection.columnSortDirection(1));

        rowNumbers = datatableSortSelection.getSelectedRowNumber();
        assertEquals(1, rowNumbers.size());
        assertNotEquals(Integer.valueOf(3), rowNumbers.get(0));

        int selectedRow = rowNumbers.get(0);
        assertEquals("Renault", datatableSortSelection.getCellValue(selectedRow, 0));
        assertEquals("Gray", datatableSortSelection.getCellValue(selectedRow, 2));
    }


    @Test
    @RunAsClient
    public void testPaginator() {
        showExample(5);
        assertEquals("Paginator", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        datatablePaginator.isWidgetValid();

        assertEquals(4, datatablePaginator.getColumnCount());
        assertEquals("brand", datatablePaginator.getColumnHeader(0));
        assertEquals("vin", datatablePaginator.getColumnHeader(3));
        assertFalse(datatablePaginator.isSortable(0));

        assertEquals(4, datatablePaginator.getRowCount());

        assertEquals("Volkswagen", datatablePaginator.getCellValue(0, 0));
        assertEquals("dsad231ff", datatablePaginator.getCellValue(0, 3));

        assertTrue(datatablePaginator.hasPaginator());

        assertFalse(datatablePaginator.isPaginatorButtonActive(PuiDatatable.PaginatorButton.FIRST));
        assertFalse(datatablePaginator.isPaginatorButtonActive(PuiDatatable.PaginatorButton.PREVIOUS));
        assertTrue(datatablePaginator.isPaginatorButtonActive(PuiDatatable.PaginatorButton.NEXT));
        assertTrue(datatablePaginator.isPaginatorButtonActive(PuiDatatable.PaginatorButton.LAST));
        assertEquals("1", datatablePaginator.getPaginatorPageNumber());

        datatablePaginator.clickPaginatorButton(PuiDatatable.PaginatorButton.NEXT);
        assertEquals("Mercedes", datatablePaginator.getCellValue(0, 0));
        assertEquals("hrtwy34", datatablePaginator.getCellValue(0, 3));

        assertTrue(datatablePaginator.isPaginatorButtonActive(PuiDatatable.PaginatorButton.FIRST));
        assertTrue(datatablePaginator.isPaginatorButtonActive(PuiDatatable.PaginatorButton.PREVIOUS));
        assertTrue(datatablePaginator.isPaginatorButtonActive(PuiDatatable.PaginatorButton.NEXT));
        assertTrue(datatablePaginator.isPaginatorButtonActive(PuiDatatable.PaginatorButton.LAST));

        assertEquals("2", datatablePaginator.getPaginatorPageNumber());

    }

    @Test
    @RunAsClient
    public void testPaginatorAndSelection() {
        showExample(5);
        assertEquals("Paginator", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        datatablePaginator.isWidgetValid();

        assertEquals(4, datatablePaginator.getColumnCount());
        assertEquals("brand", datatablePaginator.getColumnHeader(0));
        assertEquals("vin", datatablePaginator.getColumnHeader(3));
        assertFalse(datatablePaginator.isSortable(0));

        assertEquals(4, datatablePaginator.getRowCount());
        assertEquals("Volkswagen", datatablePaginator.getCellValue(0, 0));
        assertEquals("dsad231ff", datatablePaginator.getCellValue(0, 3));

        assertTrue(datatablePaginator.hasPaginator());

        datatablePaginator.clickRow(2);

        List<Integer> rowNumbers = datatablePaginator.getSelectedRowNumber();
        assertEquals(1, rowNumbers.size());
        assertEquals(Integer.valueOf(2), rowNumbers.get(0));

        assertEquals("Renault", datatablePaginator.getCellValue(2, 0));
        assertEquals("Gray", datatablePaginator.getCellValue(2, 2));

        datatablePaginator.clickPaginatorButton(PuiDatatable.PaginatorButton.NEXT);
        assertEquals("2", datatablePaginator.getPaginatorPageNumber());
        rowNumbers = datatablePaginator.getSelectedRowNumber();
        assertEquals(0, rowNumbers.size());

        datatablePaginator.clickPaginatorButton(PuiDatatable.PaginatorButton.PREVIOUS);
        assertEquals("1", datatablePaginator.getPaginatorPageNumber());

        rowNumbers = datatablePaginator.getSelectedRowNumber();
        assertEquals(1, rowNumbers.size());
        assertEquals(Integer.valueOf(2), rowNumbers.get(0));

        assertEquals("Renault", datatablePaginator.getCellValue(2, 0));
        assertEquals("Gray", datatablePaginator.getCellValue(2, 2));
    }

    @Test
    @RunAsClient
    public void testCaption() {
        showExample(6);
        assertEquals("Captions", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        datatableCaptions.isWidgetValid();

        assertEquals(3, datatableCaptions.getColumnCount());
        assertEquals("Brand column", datatableCaptions.getColumnHeader(0));
        assertEquals("Color column", datatableCaptions.getColumnHeader(2));
        assertFalse(datatableCaptions.isSortable(0));

        assertEquals(10, datatableCaptions.getRowCount());

        assertEquals("Volkswagen", datatableCaptions.getCellValue(0, 0));
        assertEquals("Blue", datatableCaptions.getCellValue(3, 2));

        assertFalse(datatableCaptions.hasPaginator());
        assertEquals("Car data", datatableCaptions.getCaption());
    }

    @Test
    @RunAsClient
    public void testMultiselection() {
        showExample(7);
        assertEquals("Multi row selection", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        datatableMulti.isWidgetValid();
        datatableMulti.clickRow(1);

        List<Integer> selection = datatableMulti.getSelectedRowNumber();
        assertEquals(1, selection.size());

        datatableMulti.clickRow(2, Keys.SHIFT);
        selection = datatableMulti.getSelectedRowNumber();
        assertEquals(2, selection.size());
        assertTrue(selection.contains(1));
        assertTrue(selection.contains(2));

        datatableMulti.clickRow(3);

        selection = datatableMulti.getSelectedRowNumber();
        assertEquals(1, selection.size());
        assertTrue(selection.contains(3));
    }


    @Test
    @RunAsClient
    public void testProgrammaticSelection() {
        showExample(8);
        assertEquals("Programmatic row selection", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        datatableProgrammaticSelection.isWidgetValid();

        List<Integer> selection = datatableProgrammaticSelection.getSelectedRowNumber();
        assertEquals(0, selection.size());

        rowIdxInput.type("3");
        selectButton.click();

        selection = datatableProgrammaticSelection.getSelectedRowNumber();
        assertEquals(1, selection.size());
        assertTrue(selection.contains(3));

        rowIdxInput.type("5");
        selectButton.click();
        selection = datatableProgrammaticSelection.getSelectedRowNumber();
        assertEquals(2, selection.size());
        assertTrue(selection.contains(3));
        assertTrue(selection.contains(5));

        rowIdxInput.type("3");
        unselectBtn.click();

        selection = datatableProgrammaticSelection.getSelectedRowNumber();
        assertEquals(1, selection.size());
        assertTrue(selection.contains(5));
    }

    @Test
    @RunAsClient
    public void testProgrammaticPagination() {
        showExample(9);
        assertEquals("Programmatic changing the current page", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        datatableProgrammaticPaginator.isWidgetValid();

        assertTrue(datatableProgrammaticPaginator.hasPaginator());
        assertEquals("1", datatableProgrammaticPaginator.getPaginatorPageNumber());

        assertEquals("Volkswagen", datatableProgrammaticPaginator.getCellValue(0, 0));
        assertEquals("White", datatableProgrammaticPaginator.getCellValue(0, 2));

        newPage.type("2");// 0 based
        gotoPageButton.click();

        waitForScreenUpdate(300);

        assertEquals("3", datatableProgrammaticPaginator.getPaginatorPageNumber());

        assertEquals("Opel", datatableProgrammaticPaginator.getCellValue(0, 0));
        assertEquals("Black", datatableProgrammaticPaginator.getCellValue(0, 2));
    }
}