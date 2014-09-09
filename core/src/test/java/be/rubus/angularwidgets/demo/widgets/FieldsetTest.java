package be.rubus.angularwidgets.demo.widgets;

import be.rubus.web.testing.annotation.Grafaces;
import be.rubus.web.testing.widget.AlertHandling;
import be.rubus.web.testing.widget.ButtonWidget;
import be.rubus.web.testing.widget.InputWidget;
import be.rubus.web.testing.widget.extension.angularwidgets.PuiFieldset;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.*;

/**
 *
 */
@RunWith(Arquillian.class)
public class FieldsetTest extends AbstractWidgetTest {

    // For the default demo
    @FindBy(id = "default")
    private PuiFieldset fieldsetDefault;

    // For the toggleable demo
    @FindBy(id = "toggle")
    private PuiFieldset fieldsetToggleable;

    // For the programmatic toggleable demo
    @FindBy(id = "programmatic")
    private PuiFieldset fieldsetProgrammaticToggleable;

    @FindBy(id = "expandBtn")
    private ButtonWidget expandButton;

    @FindBy(id = "collapseBtn")
    private ButtonWidget collpaseButton;

    // For the callback demo
    @FindBy(id = "callback")
    private PuiFieldset fieldsetCallback;

    @Grafaces
    private AlertHandling alertHandling;

    // For the dynamic legend text
    @FindBy(id = "legend")
    private PuiFieldset fieldsetLegend;

    @FindBy(id = "legendField")
    private InputWidget legendName;

    @Override
    protected int getWidgetIdx() {
        return 4;
    }

    @Test
    @RunAsClient
    public void testOverview() {
        testWidgetOverviewPage("puiFieldset", "puiFieldset", 6);
    }


    @Test
    @RunAsClient
    public void testDefault() {
        showExample(1);
        assertEquals("Default integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        fieldsetDefault.isWidgetValid();

        assertEquals("default", fieldsetDefault.getLegendText());
        assertTrue(fieldsetDefault.isContentDisplayed());
        assertFalse(fieldsetDefault.isToggleable());
    }

    @Test
    @RunAsClient
    public void testToggleable() {
        showExample(2);
        assertEquals("Toggleable", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        fieldsetToggleable.isWidgetValid();

        assertEquals("Toggleable", fieldsetToggleable.getLegendText());
        assertTrue(fieldsetToggleable.isContentDisplayed());
        assertTrue(fieldsetToggleable.isToggleable());

        fieldsetToggleable.clickToggle();
        waitForScreenUpdate(700);
        assertFalse(fieldsetToggleable.isContentDisplayed());

        fieldsetToggleable.clickToggle();
        waitForScreenUpdate(700);
        assertTrue(fieldsetToggleable.isContentDisplayed());

    }

    @Test
    @RunAsClient
    public void testProgrammaticToggleable() {
        showExample(3);
        assertEquals("Programmatic collapse and expand", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        fieldsetProgrammaticToggleable.isWidgetValid();

        assertEquals("Programmatic", fieldsetProgrammaticToggleable.getLegendText());
        assertFalse(fieldsetProgrammaticToggleable.isContentDisplayed());
        assertTrue(fieldsetProgrammaticToggleable.isToggleable());


        expandButton.click();
        waitForScreenUpdate(700);
        assertTrue(fieldsetProgrammaticToggleable.isContentDisplayed());

        collpaseButton.click();
        waitForScreenUpdate(700);
        assertFalse(fieldsetProgrammaticToggleable.isContentDisplayed());
    }

    @Test
    @RunAsClient
    public void testCallback() {
        showExample(4);
        assertEquals("Callback when user toggles", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        fieldsetCallback.isWidgetValid();

        assertEquals("Callback", fieldsetCallback.getLegendText());
        assertTrue(fieldsetCallback.isContentDisplayed());
        assertTrue(fieldsetCallback.isToggleable());

        fieldsetCallback.clickToggle();
        alertHandling.checkForAlert();
        alertHandling.switchToAlert();
        alertHandling.alertAccept();
    }

    @Test
    @RunAsClient
    public void testDynamicLegend() {
        showExample(5);
        assertEquals("AngularJS expressions in legend allowed.", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        fieldsetLegend.isWidgetValid();

        assertEquals("Change me", fieldsetLegend.getLegendText());

        legendName.type("JUnit");
        assertEquals("JUnit", fieldsetLegend.getLegendText());
    }

}
