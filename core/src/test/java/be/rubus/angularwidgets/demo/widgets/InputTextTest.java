package be.rubus.angularwidgets.demo.widgets;

import be.rubus.web.testing.widget.ButtonWidget;
import be.rubus.web.testing.widget.DivSpanWidget;
import be.rubus.web.testing.widget.extension.angularwidgets.PuiInputText;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.InvalidElementStateException;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.*;

/**
 *
 */
@RunWith(Arquillian.class)
public class InputTextTest extends AbstractWidgetTest {


    // For the default demo
    @FindBy(id = "default")
    private PuiInputText puiInputTextDefault;

    @FindBy(id = "defaultModel")
    private DivSpanWidget defaultModel;

    @FindBy(id = "digits")
    private PuiInputText puiInputTextDigits;

    @FindBy(id = "digitsModel")
    private DivSpanWidget digitsModel;

    // For the disabled demo
    @FindBy(id = "disabled")
    private PuiInputText puiInputTextDisabled;

    @FindBy(id = "enableBtn")
    private ButtonWidget enableButton;

    @FindBy(id = "disableBtn")
    private ButtonWidget disableButton;

    @FindBy(id = "modelValue")
    private DivSpanWidget modelValue;

    // For the visible demo
    @FindBy(id = "visible")
    private PuiInputText puiInputTextVisible;

    @FindBy(id = "showBtn")
    private ButtonWidget showButton;

    @FindBy(id = "hideBtn")
    private ButtonWidget hideButton;

    @Override
    protected int getWidgetIdx() {
        return 6;
    }

    @Test
    @RunAsClient
    public void testOverview() {
        testWidgetOverviewPage("puiInputText", "puiInputText", 4);
    }

    @Test
    @RunAsClient
    public void testDefault() {
        showExample(1);
        assertEquals("Default integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiInputTextDefault.isWidgetValid();

        assertEquals("text", puiInputTextDefault.getType());
        assertEquals("Change me", puiInputTextDefault.getValue());
        assertEquals("Change me", defaultModel.getContent());

        assertTrue(puiInputTextDefault.hasHoverClassWhenHovered());

        assertTrue(puiInputTextDefault.isPristine());
        assertFalse(puiInputTextDefault.isDirty());

        puiInputTextDefault.type("JUnit");

        assertEquals("JUnit", puiInputTextDefault.getValue());
        assertEquals("JUnit", defaultModel.getContent());

        assertFalse(puiInputTextDefault.isPristine());
        assertTrue(puiInputTextDefault.isDirty());

        assertEquals("number", puiInputTextDigits.getType());

        assertEquals("123", puiInputTextDigits.getValue());
        assertEquals("123", digitsModel.getContent());
        puiInputTextDigits.type("JUnit");

        assertEquals("", puiInputTextDigits.getValue());
        assertEquals("", digitsModel.getContent());
    }

    @Test
    @RunAsClient
    public void testDisabled() {
        showExample(2);
        assertEquals("Support for pui-disabled", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiInputTextDisabled.isWidgetValid();

        assertEquals("text", puiInputTextDisabled.getType());
        assertEquals("Change me", puiInputTextDisabled.getValue());
        assertEquals("Change me", modelValue.getContent());

        try {
            puiInputTextDisabled.type("Not possible");
            fail("Disabled field can't be changed");
        } catch (InvalidElementStateException e) {
            ; // correct flow
        }

        enableButton.click();

        puiInputTextDisabled.type("JUnit");

        assertEquals("JUnit", puiInputTextDisabled.getValue());
        assertEquals("JUnit", modelValue.getContent());

        disableButton.click();
        try {
            puiInputTextDisabled.type("Not possible");
            fail("Disabled field can't be changed");
        } catch (InvalidElementStateException e) {
            ; // correct flow
        }
    }

    @Test
    @RunAsClient
    public void testVisible() {
        showExample(3);
        assertEquals("Support for rendered", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        puiInputTextVisible.isWidgetValid();

        assertFalse(puiInputTextVisible.isVisible());

        showButton.click();
        waitForScreenUpdate(700);
        assertTrue(puiInputTextVisible.isVisible());

        puiInputTextVisible.type("JUnit");

        assertEquals("JUnit", puiInputTextVisible.getValue());
        assertEquals("JUnit", modelValue.getContent());

        hideButton.click();
        waitForScreenUpdate(700);
        assertFalse(puiInputTextVisible.isVisible());
    }

}
