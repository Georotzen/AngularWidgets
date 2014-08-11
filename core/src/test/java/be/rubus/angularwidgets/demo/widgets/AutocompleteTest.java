package be.rubus.angularwidgets.demo.widgets;


import be.rubus.web.testing.annotation.Grafaces;
import be.rubus.web.testing.widget.AlertHandling;
import be.rubus.web.testing.widget.ButtonWidget;
import be.rubus.web.testing.widget.DivSpanWidget;
import be.rubus.web.testing.widget.extension.angularwidgets.PuiAutocomplete;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.Keys;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;

/**
 *
 */
@RunWith(Arquillian.class)
public class AutocompleteTest extends AbstractWidgetTest {

    // For the default demo
    @FindBy(id = "default")
    private PuiAutocomplete autocompleteDefault;

    @FindBy(id = "modelValue")
    private DivSpanWidget modelValue;

    // For the dropdown demo
    @FindBy(id = "dropdown")
    private PuiAutocomplete autocompleteDropdown;

    // For the function demo
    @FindBy(id = "function")
    private PuiAutocomplete autocompleteFunction;

    // For the disabled demo
    @FindBy(id = "enableBtn")
    private ButtonWidget enableButton;

    @FindBy(id = "disableBtn")
    private ButtonWidget disableButton;

    // For the multiple demo
    @FindBy(id = "multiple")
    private PuiAutocomplete autocompleteMultiple;

    // For the limit selection demo
    @FindBy(id = "limit")
    private PuiAutocomplete autocompleteLimit;

    // For the callback demo
    @FindBy(id = "callback")
    private PuiAutocomplete autocompleteCallback;

    @Grafaces
    private AlertHandling alertHandling;

    @Override
    protected int getWidgetIdx() {
        return 0;
    }

    @Test
    @RunAsClient
    public void testOverview() {
        testWidgetOverviewPage("puiAutocomplete", "puiAutocomplete", 8);
    }

    @Test
    @RunAsClient
    public void testDefault() {
        showExample(1);
        assertEquals("Default integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        assertFalse(autocompleteDefault.hasDropdownButton());
        assertFalse(autocompleteDefault.isDisabled());
        assertFalse(autocompleteDefault.isMultipleSelection());

        assertFalse(autocompleteDefault.isPanelVisible());
        autocompleteDefault.type("BE");

        assertTrue(autocompleteDefault.isPanelVisible());

        assertEquals(5, autocompleteDefault.getPanelItemCount());
        assertEquals("Belarus", autocompleteDefault.getPanelItemText(0));
        assertEquals("Belgium", autocompleteDefault.getPanelItemText(1));
        assertEquals("Bermuda", autocompleteDefault.getPanelItemText(4));

        autocompleteDefault.selectPanelItem(1);
        assertFalse(autocompleteDefault.isPanelVisible());

        assertEquals("Belgium", autocompleteDefault.getValue());
        assertEquals("Belgium", modelValue.getContent());

        // autocomplete is not enforced
        autocompleteDefault.type("xx");
        assertEquals("xx", modelValue.getContent());
        modelValue.click();
        assertEquals("xx", modelValue.getContent());
    }

    @Test
    @RunAsClient
    public void testDefaultBehaviour() {
        showExample(1);
        assertEquals("Default integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        autocompleteDefault.isWidgetValid();
        assertTrue(autocompleteDefault.hasFieldHoverClassWhenHovered());

        autocompleteDefault.type("be");

        assertEquals(5, autocompleteDefault.getPanelItemCount());
        assertEquals("Belarus", autocompleteDefault.getPanelItemText(0));
        assertEquals("Belgium", autocompleteDefault.getPanelItemText(1));
        assertEquals("Bermuda", autocompleteDefault.getPanelItemText(4));

        assertEquals("Belarus", autocompleteDefault.getPanelHighlightedItemText());
        autocompleteDefault.sendKeys(Keys.ARROW_DOWN);
        assertEquals("Belgium", autocompleteDefault.getPanelHighlightedItemText());
    }

    @Test
    @RunAsClient
    public void testDropdown() {
        showExample(2);
        assertEquals("Additional arrow button for all options", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        autocompleteDropdown.isWidgetValid();
        assertTrue(autocompleteDropdown.hasDropdownButton());

        assertFalse(autocompleteDropdown.isPanelVisible());
        autocompleteDropdown.clickDropdownButton();
        assertTrue(autocompleteDropdown.isPanelVisible());

        assertEquals(191, autocompleteDropdown.getPanelItemCount());

        autocompleteDropdown.selectPanelItem(20);
        assertEquals("Bermuda", autocompleteDropdown.getValue());
        assertEquals("Bermuda", modelValue.getContent());
    }

    @Test
    @RunAsClient
    public void testFunction() {
        showExample(3);
        assertEquals("Autocomplete with a function", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        autocompleteFunction.isWidgetValid();
        assertFalse(autocompleteFunction.hasDropdownButton());

        assertFalse(autocompleteFunction.isPanelVisible());
        autocompleteFunction.type("test");

        assertTrue(autocompleteFunction.isPanelVisible());

        assertEquals(5, autocompleteFunction.getPanelItemCount());
        assertEquals("test0", autocompleteFunction.getPanelItemText(0));
        assertEquals("test1", autocompleteFunction.getPanelItemText(1));
        assertEquals("test4", autocompleteFunction.getPanelItemText(4));

        autocompleteFunction.selectPanelItem(1);
        assertFalse(autocompleteFunction.isPanelVisible());

        assertEquals("test1", autocompleteFunction.getValue());
        assertEquals("test1", modelValue.getContent());
    }

    @Test
    @RunAsClient
    public void testDisabled() {
        showExample(4);
        assertEquals("Integration with pui-disabled", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        autocompleteDefault.isWidgetValid();
        autocompleteDropdown.isWidgetValid();
        assertTrue(autocompleteDefault.isDisabled());
        assertTrue(autocompleteDropdown.isDisabled());

        enableButton.click();

        assertFalse(autocompleteDefault.isDisabled());
        assertFalse(autocompleteDropdown.isDisabled());

        autocompleteDefault.type("BE");

        assertTrue(autocompleteDefault.isPanelVisible());

        autocompleteDefault.selectPanelItem(1);
        assertFalse(autocompleteDefault.isPanelVisible());

        assertEquals("Belgium", autocompleteDefault.getValue());
        assertEquals("Belgium", modelValue.getContent());

        disableButton.click();

        assertTrue(autocompleteDefault.isDisabled());
        assertTrue(autocompleteDropdown.isDisabled());
        autocompleteDropdown.clickDropdownButton();
        assertFalse(autocompleteDefault.isPanelVisible());
    }

    @Test
    @RunAsClient
    public void testMultipleSelection() {
        showExample(5);
        assertEquals("Multiple values integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        autocompleteMultiple.isWidgetValid();
        assertTrue(autocompleteMultiple.isMultipleSelection());

        assertEquals(0, autocompleteMultiple.getMultipleSelectedCount());

        assertFalse(autocompleteMultiple.isPanelVisible());

        autocompleteMultiple.type("be");
        assertTrue(autocompleteMultiple.isPanelVisible());

        autocompleteMultiple.selectPanelItem(1);
        assertFalse(autocompleteMultiple.isPanelVisible());

        assertEquals(1, autocompleteMultiple.getMultipleSelectedCount());

        assertEquals("Belgium", autocompleteMultiple.getMultipleSelectionItemLabel(0));

        autocompleteMultiple.type("ne");
        autocompleteMultiple.selectPanelItem(1);

        assertEquals(2, autocompleteMultiple.getMultipleSelectedCount());

        assertEquals("Netherlands", autocompleteMultiple.getMultipleSelectionItemLabel(0));
        assertEquals("Belgium", autocompleteMultiple.getMultipleSelectionItemLabel(1));

        autocompleteMultiple.removeMultipleSelectionItem(1);
        assertEquals(1, autocompleteMultiple.getMultipleSelectedCount());

        assertEquals("Netherlands", autocompleteMultiple.getMultipleSelectionItemLabel(0));

    }

    @Test
    @RunAsClient
    public void testLimitSelection() {
        showExample(6);
        assertEquals("Limit the value to the allowed list", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        autocompleteLimit.isWidgetValid();

        autocompleteLimit.type("xx");
        assertEquals("xx", modelValue.getContent());

        modelValue.click();

        assertEquals("", modelValue.getContent());
    }


    @Test
    @RunAsClient
    public void testCallback() {
        showExample(7);
        assertEquals("Callback when user selects from proposed list", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        autocompleteCallback.isWidgetValid();

        autocompleteCallback.type("be");
        autocompleteCallback.selectPanelItem(1);

        assertEquals("Belgium selected ", alertHandling.checkForAlert().switchToAlert().getAlertText());

        alertHandling.alertAccept();
        alertHandling.releaseAlert();
    }
}