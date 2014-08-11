package be.rubus.angularwidgets.demo.widgets;

import be.rubus.angularwidgets.demo.Deployed;
import be.rubus.angularwidgets.widget.BrowserWindow;
import be.rubus.angularwidgets.widget.ContentArea;
import be.rubus.angularwidgets.widget.WidgetSelection;
import be.rubus.web.testing.annotation.Grafaces;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.junit.Ignore;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.FindBy;

import static org.junit.Assert.assertEquals;

@Ignore
public abstract class AbstractWidgetTest {

    protected static final String VERSION_0_6 = "0.6";
    protected static final String VERSION_0_3 = "0.3";
    protected static final String VERSION_INITIAL = "";

    @Drone
    protected WebDriver driver;

    @FindBy(id = "widgetList")
    protected WidgetSelection widgetSelection;

    @FindBy(id = "content")
    protected ContentArea contentArea;

    @Grafaces
    protected BrowserWindow window;


    protected final void showExample(int exampleIdx) {
        driver.get(Deployed.ROOT);
        widgetSelection.selectWidget(getWidgetIdx());
        contentArea.gotoExample(exampleIdx);
    }

    protected final void testWidgetOverviewPage(String widgetName, String title, int subPageCount) {
        driver.get(Deployed.ROOT);
        assertEquals(widgetName, widgetSelection.getWidgetName(getWidgetIdx()));
        widgetSelection.selectWidget(getWidgetIdx());
        assertEquals(title, contentArea.getName());

        assertEquals(subPageCount, contentArea.getSubpagesCount());

    }

    protected abstract int getWidgetIdx();

    public void waitForScreenUpdate(int timeInMiliis) {
        try {
            Thread.sleep(timeInMiliis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
