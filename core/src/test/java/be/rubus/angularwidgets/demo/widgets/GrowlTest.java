package be.rubus.angularwidgets.demo.widgets;

import be.rubus.web.testing.annotation.Grafaces;
import be.rubus.web.testing.widget.ButtonWidget;
import be.rubus.web.testing.widget.extension.angularwidgets.PuiGrowl;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.assertEquals;

/**
 *
 */
@RunWith(Arquillian.class)
public class GrowlTest extends AbstractWidgetTest {

    @Grafaces
    private PuiGrowl puiGrowl;

    // For the default demo
    @FindBy(id = "infoBtn")
    private ButtonWidget infoButton;

    @FindBy(id = "errorBtn")
    private ButtonWidget errorButton;

    @FindBy(id = "warnBtn")
    private ButtonWidget warnButton;


    @Override
    protected int getWidgetIdx() {
        return 4;
    }


    @Test
    @RunAsClient
    public void testOverview() {
        testWidgetOverviewPage("puiGrowl", "puiGrowl", 3);
    }

    @Test
    @RunAsClient
    public void testDefault() {
        showExample(1);
        assertEquals("Default integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        assertEquals(0, puiGrowl.getNumberOfMessages());

        infoButton.click();
        assertEquals(1, puiGrowl.getNumberOfMessages());
        assertEquals("Info message title", puiGrowl.getMessageTitle(0));
        assertEquals("Info detail message", puiGrowl.getMessageText(0));
        assertEquals(PuiGrowl.Severity.INFO, puiGrowl.getMessageSeverity(0));

        puiGrowl.closeMessage(0);

        waitForScreenUpdate(1000);
        assertEquals(0, puiGrowl.getNumberOfMessages());
    }

    @Test
    @RunAsClient
    public void testDefaultWaitForClose() {
        showExample(1);
        assertEquals("Default integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        infoButton.click();
        assertEquals(1, puiGrowl.getNumberOfMessages());

        waitForScreenUpdate(3500);

        assertEquals(0, puiGrowl.getNumberOfMessages());
    }

    @Test
    @RunAsClient
    public void testDefaultOtherSeverities() {
        showExample(1);
        assertEquals("Default integration", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        assertEquals(0, puiGrowl.getNumberOfMessages());

        errorButton.click();
        assertEquals(1, puiGrowl.getNumberOfMessages());
        assertEquals("Error message title", puiGrowl.getMessageTitle(0));
        assertEquals("Error detail message", puiGrowl.getMessageText(0));
        assertEquals(PuiGrowl.Severity.ERROR, puiGrowl.getMessageSeverity(0));

        warnButton.click();
        assertEquals(2, puiGrowl.getNumberOfMessages());
        assertEquals("Warn message title", puiGrowl.getMessageTitle(1));
        assertEquals("Warn detail message", puiGrowl.getMessageText(1));
        assertEquals(PuiGrowl.Severity.WARN, puiGrowl.getMessageSeverity(1));

    }

    @Test
    @RunAsClient
    public void testSticky() {
        showExample(2);
        assertEquals("Sticky message example", contentArea.getExampleName());
        assertEquals(VERSION_INITIAL, contentArea.getNewInVersionNumber());

        infoButton.click();
        assertEquals(1, puiGrowl.getNumberOfMessages());

        waitForScreenUpdate(3500);

        assertEquals(1, puiGrowl.getNumberOfMessages());

        puiGrowl.closeMessage(0);

        waitForScreenUpdate(1000);
        assertEquals(0, puiGrowl.getNumberOfMessages());

    }
}
