package be.rubus.angularwidgets.demo.widgets;

import be.rubus.web.testing.annotation.Grafaces;
import be.rubus.web.testing.widget.AlertHandling;
import be.rubus.web.testing.widget.ButtonWidget;
import be.rubus.web.testing.widget.DivSpanWidget;
import be.rubus.web.testing.widget.InputWidget;
import be.rubus.web.testing.widget.extension.angularwidgets.PuiTabview;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.*;

@RunWith(Arquillian.class)
public class TabviewTest extends AbstractWidgetTest {

    // For the default demo
    @FindBy(id = "default")
    private PuiTabview puiTabviewDefault;

    // For the closeable
    @FindBy(id = "closeable")
    private PuiTabview puiTabviewCloseable;

    // For the left demo
    @FindBy(id = "left")
    private PuiTabview puiTabviewLeft;

    // For the callback demo
    @FindBy(id = "callback")
    private PuiTabview puiTabviewCallback;

    @Grafaces
    private AlertHandling alertHandling;

    // For the Dynamic demo
    @FindBy(id = "dynamic")
    private PuiTabview puiTabviewDynamic;

    @FindBy(id = "title1")
    private InputWidget title1;

    @FindBy(id = "title2")
    private InputWidget title2;

    @FindBy(id = "desc1")
    private InputWidget description1;

    @FindBy(id = "desc2")
    private InputWidget description2;

    // For the programmatic change demo
    @FindBy(id = "programmatic")
    private PuiTabview puiTabviewProgrammatic;

    @FindBy(id = "activeTab")
    private InputWidget activeIndex;

    @FindBy(id = "setTab")
    private ButtonWidget setActiveTab;

    // For the URL demo
    @FindBy(id = "repeat")
    private PuiTabview puiTabviewURL;

    @FindBy(id = "addPanel")
    private ButtonWidget addPanelBtn;

    @FindBy(id = "field1")
    private InputWidget field1;

    @FindBy(id = "field2")
    private InputWidget field2;

    @FindBy(id = "field3")
    private InputWidget field3;

    @FindBy(id = "field1Value")
    private DivSpanWidget field1Value;

    @FindBy(id = "field2Value")
    private DivSpanWidget field2Value;

    @FindBy(id = "field3Value")
    private DivSpanWidget field3Value;

    @Override
    protected int getWidgetIdx() {
        return 8;
    }

    @Test
    @RunAsClient
    public void testOverview() {
        testWidgetOverviewPage("puiTabview", "puiTabview", 8);
    }

    @Test
    @RunAsClient
    public void testDefault() {
        showExample(1);
        assertEquals("Default integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiTabviewDefault.isWidgetValid();

        assertEquals(3, puiTabviewDefault.getTabCount());
        assertEquals("Tab 1", puiTabviewDefault.getLinkText(0));
        assertEquals("Tab 3", puiTabviewDefault.getLinkText(2));
        assertFalse(puiTabviewDefault.hasTabCloseIcon(0));
        assertFalse(puiTabviewDefault.isLeftOrientation());

        assertEquals(0, puiTabviewDefault.getSelectedTab());
        assertEquals(0, puiTabviewDefault.getVisiblePanel());

        puiTabviewDefault.clickOnTab(1);

        assertEquals(1, puiTabviewDefault.getSelectedTab());
        assertEquals(1, puiTabviewDefault.getVisiblePanel());
    }

    @Test
    @RunAsClient
    public void testCloseable() {
        showExample(2);
        assertEquals("Tabs can be closeable", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiTabviewCloseable.isWidgetValid();

        assertEquals(3, puiTabviewCloseable.getTabCount());
        assertEquals("Tab 1", puiTabviewCloseable.getLinkText(0));
        assertEquals("Tab 3", puiTabviewCloseable.getLinkText(2));
        assertTrue(puiTabviewCloseable.hasTabCloseIcon(0));


        puiTabviewCloseable.closeTab(1);

        assertEquals(2, puiTabviewCloseable.getTabCount());
        assertEquals("Tab 1", puiTabviewCloseable.getLinkText(0));
        assertEquals("Tab 3", puiTabviewCloseable.getLinkText(1));
    }

    @Test
    @RunAsClient
    public void testLeftOrientation() {
        showExample(3);
        assertEquals("Left orientation of the tabs", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiTabviewLeft.isWidgetValid();

        assertEquals(3, puiTabviewLeft.getTabCount());
        assertEquals("Tab 1", puiTabviewLeft.getLinkText(0));
        assertEquals("Tab 3", puiTabviewLeft.getLinkText(2));
        assertFalse(puiTabviewLeft.hasTabCloseIcon(0));
        assertTrue(puiTabviewLeft.isLeftOrientation());

        assertEquals(0, puiTabviewLeft.getSelectedTab());
        assertEquals(0, puiTabviewLeft.getVisiblePanel());

        puiTabviewLeft.clickOnTab(1);

        assertEquals(1, puiTabviewLeft.getSelectedTab());
        assertEquals(1, puiTabviewLeft.getVisiblePanel());
    }

    @Test
    @RunAsClient
    public void testCallback() {
        showExample(4);
        assertEquals("Callback when user selects tab", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiTabviewCallback.isWidgetValid();

        assertEquals(3, puiTabviewCallback.getTabCount());
        assertEquals("Tab 1", puiTabviewCallback.getLinkText(0));
        assertEquals("Tab 3", puiTabviewCallback.getLinkText(2));
        assertFalse(puiTabviewCallback.hasTabCloseIcon(0));
        assertFalse(puiTabviewCallback.isLeftOrientation());

        assertEquals(0, puiTabviewCallback.getSelectedTab());
        assertEquals(0, puiTabviewCallback.getVisiblePanel());

        puiTabviewCallback.clickOnTab(1);

        alertHandling.checkForAlert().switchToAlert().alertAccept();
        alertHandling.releaseAlert();

        assertEquals(1, puiTabviewCallback.getSelectedTab());
        assertEquals(1, puiTabviewCallback.getVisiblePanel());
    }

    @Test
    @RunAsClient
    public void testDynamic() {
        showExample(5);
        assertEquals("Title and content can be dynamic", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiTabviewDynamic.isWidgetValid();

        assertEquals(2, puiTabviewDynamic.getTabCount());
        assertEquals("title1", puiTabviewDynamic.getLinkText(0));
        assertEquals("title2", puiTabviewDynamic.getLinkText(1));
        assertFalse(puiTabviewDynamic.hasTabCloseIcon(0));
        assertFalse(puiTabviewDynamic.isLeftOrientation());

        assertEquals(0, puiTabviewDynamic.getSelectedTab());
        assertEquals(0, puiTabviewDynamic.getVisiblePanel());

        puiTabviewDynamic.clickOnTab(1);

        assertEquals(1, puiTabviewDynamic.getSelectedTab());
        assertEquals(1, puiTabviewDynamic.getVisiblePanel());

        title1.type("JUnit");
        title2.type("Awesome");

        assertEquals("JUnit", puiTabviewDynamic.getLinkText(0));
        assertEquals("Awesome", puiTabviewDynamic.getLinkText(1));

        assertEquals("description2", puiTabviewDynamic.getPanelContent(1));

        description2.type("Contents panel 2");
        assertEquals("Contents panel 2", puiTabviewDynamic.getPanelContent(1));

        description1.type("Contents panel 1");
        puiTabviewDynamic.clickOnTab(0);
        assertEquals("Contents panel 1", puiTabviewDynamic.getPanelContent(0));
    }

    @Test
    @RunAsClient
    public void testProgrammatic() {
        showExample(6);
        assertEquals("Programmatic setting the active tab", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiTabviewProgrammatic.isWidgetValid();

        assertEquals(3, puiTabviewProgrammatic.getTabCount());
        assertEquals("Tab 1", puiTabviewProgrammatic.getLinkText(0));
        assertEquals("Tab 3", puiTabviewProgrammatic.getLinkText(2));
        assertFalse(puiTabviewProgrammatic.hasTabCloseIcon(0));
        assertFalse(puiTabviewProgrammatic.isLeftOrientation());

        assertEquals(0, puiTabviewProgrammatic.getSelectedTab());
        assertEquals(0, puiTabviewProgrammatic.getVisiblePanel());

        activeIndex.type("2");
        setActiveTab.click();

        assertEquals(2, puiTabviewProgrammatic.getSelectedTab());
        assertEquals(2, puiTabviewProgrammatic.getVisiblePanel());
    }

    @Test
    @RunAsClient
    public void testPanelLoad() {
        showExample(7);
        assertEquals("Tab panels included", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiTabviewURL.isWidgetValid();

        assertEquals(2, puiTabviewURL.getTabCount());
        assertEquals("Tab 1", puiTabviewURL.getLinkText(0));
        assertEquals("Tab 2", puiTabviewURL.getLinkText(1));
        assertFalse(puiTabviewURL.hasTabCloseIcon(0));
        assertFalse(puiTabviewURL.isLeftOrientation());

        field1.type("JUnit");
        assertEquals("JUnit", field1Value.getContent());

        puiTabviewURL.clickOnTab(1);

        assertEquals(1, puiTabviewURL.getSelectedTab());
        assertEquals(1, puiTabviewURL.getVisiblePanel());

        addPanelBtn.click();
        puiTabviewURL.reinitialise();

        assertEquals(3, puiTabviewURL.getTabCount());

        assertEquals(0, puiTabviewURL.getSelectedTab());
        assertEquals(0, puiTabviewURL.getVisiblePanel());

        puiTabviewURL.clickOnTab(2);
        assertEquals(2, puiTabviewURL.getSelectedTab());
        assertEquals(2, puiTabviewURL.getVisiblePanel());

        field3.type("Great");
        assertEquals("Great", field3Value.getContent());
    }
}
