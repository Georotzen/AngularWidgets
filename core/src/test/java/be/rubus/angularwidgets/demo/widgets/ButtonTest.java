package be.rubus.angularwidgets.demo.widgets;

import be.rubus.web.testing.annotation.Grafaces;
import be.rubus.web.testing.widget.AlertHandling;
import be.rubus.web.testing.widget.ButtonWidget;
import be.rubus.web.testing.widget.InputWidget;
import be.rubus.web.testing.widget.extension.angularwidgets.PuiButton;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.ElementNotVisibleException;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.*;

/**
 *
 */
@RunWith(Arquillian.class)
public class ButtonTest extends AbstractWidgetTest {

    @Grafaces
    private AlertHandling alertHandling;

    // For the default demo
    @FindBy(id = "default")
    private PuiButton puiButtonDefault;

    // For the disabled demo
    @FindBy(id = "disabled")
    private PuiButton puiButtonDisabled;

    @FindBy(id = "enableBtn")
    private ButtonWidget enableButton;

    @FindBy(id = "disableBtn")
    private ButtonWidget disableButton;

    // For the icon position demo
    @FindBy(id = "left")
    private PuiButton puiButtonLeftIcon;

    @FindBy(id = "right")
    private PuiButton puiButtonRightIcon;

    @FindBy(id = "iconOnly")
    private PuiButton puiButtonIconOnly;

    // For the dynamic title demo
    @FindBy(id = "dynamic")
    private PuiButton puiButtonDynamic;

    @FindBy(id="title")
    private InputWidget titleField;

    // For the visible demo
    @FindBy(id = "visible")
    private PuiButton puiButtonVisible;

    @FindBy(id = "showBtn")
    private ButtonWidget showButton;

    @FindBy(id = "hideBtn")
    private ButtonWidget hideButton;

    @Override
    protected int getWidgetIdx() {
        return 1;
    }

    @Test
    @RunAsClient
    public void testOverview() {
        testWidgetOverviewPage("puiButton", "puiButton", 6);
    }

    @Test
    @RunAsClient
    public void testDefault() {
        showExample(1);
        assertEquals("Default integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiButtonDefault.isWidgetValid();

        assertEquals("AngularWidgets", puiButtonDefault.getLabel());

        assertFalse(puiButtonDefault.hasIcon());
        assertFalse(puiButtonDefault.isDisabled());

        puiButtonDefault.click();
        alertHandling.checkForAlert();
        alertHandling.switchToAlert().alertAccept();

        alertHandling.releaseAlert();
    }

    @Test
    @RunAsClient
    public void testDisabled() {
        showExample(2);
        assertEquals("Support for pui-disabled", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiButtonDisabled.isWidgetValid();
        assertEquals("Disabled", puiButtonDisabled.getLabel());

        assertFalse(puiButtonDisabled.hasIcon());
        assertTrue(puiButtonDisabled.isDisabled());

        puiButtonDisabled.click();
        alertHandling.checkForNoAlert();

        enableButton.click();
        assertFalse(puiButtonDisabled.isDisabled());

        puiButtonDisabled.click();
        alertHandling.checkForAlert();
        alertHandling.switchToAlert().alertAccept();

        alertHandling.releaseAlert();
        disableButton.click();
        assertTrue(puiButtonDisabled.isDisabled());
    }

    @Test
    @RunAsClient
    public void testIcons() {
        showExample(3);
        assertEquals("Icons can be placed on button", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiButtonLeftIcon.isWidgetValid();

        assertEquals("Left Icon", puiButtonLeftIcon.getLabel());

        assertTrue(puiButtonLeftIcon.hasIcon());
        assertFalse(puiButtonLeftIcon.isDisabled());
        assertEquals("check", puiButtonLeftIcon.getIconName());

        puiButtonLeftIcon.click();
        alertHandling.checkForAlert();
        alertHandling.switchToAlert().alertAccept();

        alertHandling.releaseAlert();

        puiButtonRightIcon.isWidgetValid();

        assertEquals("Right icon", puiButtonRightIcon.getLabel());

        assertTrue(puiButtonRightIcon.hasIcon());
        assertFalse(puiButtonRightIcon.isDisabled());
        assertEquals("close", puiButtonRightIcon.getIconName());

        puiButtonRightIcon.click();
        alertHandling.checkForAlert();
        alertHandling.switchToAlert().alertAccept();

        alertHandling.releaseAlert();

        puiButtonIconOnly.isWidgetValid();

        assertNull(puiButtonIconOnly.getLabel());

        assertTrue(puiButtonIconOnly.hasIcon());
        assertFalse(puiButtonIconOnly.isDisabled());
        assertEquals("disk", puiButtonIconOnly.getIconName());

        puiButtonIconOnly.click();
        alertHandling.checkForAlert();
        alertHandling.switchToAlert().alertAccept();

        alertHandling.releaseAlert();

    }

    @Test
    @RunAsClient
    public void testDynamicTitle() {
        showExample(4);
        assertEquals("Text on button can be dynamic", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiButtonDynamic.isWidgetValid();

        assertEquals("change me", puiButtonDynamic.getLabel());

        assertFalse(puiButtonDynamic.hasIcon());
        assertFalse(puiButtonDynamic.isDisabled());

        puiButtonDynamic.click();
        alertHandling.checkForAlert();
        alertHandling.switchToAlert().alertAccept();

        alertHandling.releaseAlert();

        titleField.type("JUnit");
        assertEquals("JUnit", puiButtonDynamic.getLabel());


        puiButtonDynamic.click();
        alertHandling.checkForAlert();
        alertHandling.switchToAlert().alertAccept();

        alertHandling.releaseAlert();
    }

    @Test
    @RunAsClient
    public void testVisible() {
        showExample(5);
        assertEquals("Support for rendered", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiButtonVisible.isWidgetValid();

        assertFalse(puiButtonVisible.isVisible());
        try {
            puiButtonVisible.click();
            fail("Hidden element should not be clickable");
        } catch (ElementNotVisibleException e) {
            ; // Correct behaviour
        }
        showButton.click();
        waitForScreenUpdate(500);
        assertTrue(puiButtonVisible.isVisible());

        assertEquals("Now visible", puiButtonVisible.getLabel());

        assertFalse(puiButtonVisible.hasIcon());
        assertFalse(puiButtonVisible.isDisabled());

        puiButtonVisible.click();
        alertHandling.checkForAlert();
        alertHandling.switchToAlert().alertAccept();

        alertHandling.releaseAlert();
        hideButton.click();
        waitForScreenUpdate(700);
        assertFalse(puiButtonVisible.isVisible());
    }
}
