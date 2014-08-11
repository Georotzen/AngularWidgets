package be.rubus.angularwidgets.demo.widgets;

import be.rubus.web.testing.widget.ButtonWidget;
import be.rubus.web.testing.widget.InputWidget;
import be.rubus.web.testing.widget.extension.angularwidgets.PuiPanel;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.*;

@RunWith(Arquillian.class)
public class PanelTest extends AbstractWidgetTest {

    // For the default demo
    @FindBy(id = "default")
    private PuiPanel puiPanelDefault;

    // for the options demo
    @FindBy(id = "options")
    private PuiPanel puiPanelOptions;

    // for the Horizontal toggle demo
    @FindBy(id = "horiztoggle")
    private PuiPanel puiPanelHorizontal;

    // for the programmatic toggle demo
    @FindBy(id = "progToggle")
    private PuiPanel puiPanelProgToggle;

    @FindBy(id = "expandBtn")
    private ButtonWidget expandButton;

    @FindBy(id = "collapseBtn")
    private ButtonWidget collapseButton;

    // For the variable title demo
    @FindBy(id = "variableTitle")
    private PuiPanel puiPanelVariableTitle;

    @FindBy(id = "panelTitle")
    private InputWidget panelTitle;

    // for the element demo
    @FindBy(id = "element")
    private PuiPanel puiPanelElement;

    @Override
    protected int getWidgetIdx() {
        return 6;
    }

    @Test
    @RunAsClient
    public void testOverview() {
        testWidgetOverviewPage("puiPanel", "puiPanel", 7);
    }

    @Test
    @RunAsClient
    public void testDefault() {
        showExample(1);
        assertEquals("Default integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiPanelDefault.isWidgetValid();

        assertEquals("Default", puiPanelDefault.getTitle());
        assertTrue(puiPanelDefault.isContentDisplayed());
    }

    @Test
    @RunAsClient
    public void testOptionsClose() {
        showExample(2);

        assertEquals("Collapseable and closeable can be specified by options", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiPanelOptions.isWidgetValid();

        assertTrue(puiPanelOptions.isCloseable());
        assertEquals("Toggle and Close", puiPanelOptions.getTitle());
        assertTrue(puiPanelOptions.isContentDisplayed());
        assertTrue(puiPanelOptions.isTitlebarDisplayed());

        puiPanelOptions.closePanel();
        waitForScreenUpdate(700);

        try {
            puiPanelOptions.isValidWidget();
            fail("Panel should be removed and thus no longer valid");
        } catch (NoSuchElementException e) {
            ; //expected
        }

    }


    @Test
    @RunAsClient
    public void testOptionsCollapse() {
        showExample(2);
        assertEquals("Collapseable and closeable can be specified by options", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiPanelOptions.isWidgetValid();

        assertTrue(puiPanelOptions.isCollapsable());
        assertEquals("Toggle and Close", puiPanelOptions.getTitle());
        assertTrue(puiPanelOptions.isContentDisplayed());
        assertTrue(puiPanelOptions.isTitlebarDisplayed());
        assertTrue(puiPanelOptions.isTitleDisplayed());
        assertTrue(puiPanelOptions.isButtonForCollapseVisible());
        assertFalse(puiPanelOptions.isButtonForExpandVisible());

        puiPanelOptions.toggleCollapse();
        waitForScreenUpdate(700);

        assertFalse(puiPanelOptions.isContentDisplayed());
        assertTrue(puiPanelOptions.isTitlebarDisplayed());
        assertTrue(puiPanelOptions.isTitleDisplayed());
        assertFalse(puiPanelOptions.isButtonForCollapseVisible());
        assertTrue(puiPanelOptions.isButtonForExpandVisible());

        puiPanelOptions.toggleCollapse();
        waitForScreenUpdate(700);
        assertTrue(puiPanelOptions.isContentDisplayed());
        assertTrue(puiPanelOptions.isButtonForCollapseVisible());
        assertFalse(puiPanelOptions.isButtonForExpandVisible());
    }

    @Test
    @RunAsClient
    public void testHorizontalToggle() {
        showExample(3);
        assertEquals("Horizontal toggle", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiPanelHorizontal.isWidgetValid();

        assertTrue(puiPanelHorizontal.isCollapsable());
        assertEquals("Horizontal Toggle", puiPanelHorizontal.getTitle());
        assertTrue(puiPanelHorizontal.isContentDisplayed());
        assertTrue(puiPanelHorizontal.isTitlebarDisplayed());
        assertTrue(puiPanelHorizontal.isTitleDisplayed());
        assertTrue(puiPanelHorizontal.isButtonForCollapseVisible());
        assertFalse(puiPanelHorizontal.isButtonForExpandVisible());

        puiPanelHorizontal.toggleCollapse();
        waitForScreenUpdate(700);

        assertFalse(puiPanelHorizontal.isContentDisplayed());
        assertTrue(puiPanelHorizontal.isTitlebarDisplayed());
        assertFalse(puiPanelHorizontal.isTitleDisplayed());
        assertFalse(puiPanelHorizontal.isButtonForCollapseVisible());
        assertTrue(puiPanelHorizontal.isButtonForExpandVisible());

        puiPanelHorizontal.toggleCollapse();
        waitForScreenUpdate(500);
        assertTrue(puiPanelHorizontal.isContentDisplayed());
        assertTrue(puiPanelHorizontal.isTitleDisplayed());
        assertTrue(puiPanelHorizontal.isButtonForCollapseVisible());
        assertFalse(puiPanelHorizontal.isButtonForExpandVisible());
    }

    @Test
    @RunAsClient
    public void testProgrammaticToggle() {
        showExample(4);
        assertEquals("Programmatic collapse/expand", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiPanelProgToggle.isWidgetValid();

        assertFalse(puiPanelProgToggle.isCollapsable());

        assertTrue(puiPanelProgToggle.isContentDisplayed());
        assertTrue(puiPanelProgToggle.isTitlebarDisplayed());
        assertTrue(puiPanelProgToggle.isTitleDisplayed());

        collapseButton.click();
        waitForScreenUpdate(700);

        assertFalse(puiPanelProgToggle.isContentDisplayed());
        assertTrue(puiPanelProgToggle.isTitlebarDisplayed());
        assertTrue(puiPanelProgToggle.isTitleDisplayed());

        expandButton.click();
        waitForScreenUpdate(700);
        assertTrue(puiPanelProgToggle.isContentDisplayed());
    }

    @Test
    @RunAsClient
    public void testVariableTitle() {
        showExample(5);
        assertEquals("Dynamic title", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiPanelVariableTitle.isWidgetValid();

        assertEquals("Variable title : Change me", puiPanelVariableTitle.getTitle());

        panelTitle.type("JUnit");

        assertEquals("Variable title : JUnit", puiPanelVariableTitle.getTitle());

    }


}
