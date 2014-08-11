package be.rubus.angularwidgets.widget;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;

public class BrowserWindow {

    @Drone
    protected WebDriver driver;

    public boolean doesBrowserSupportNumericInputTypes() {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        return (Boolean) js.executeScript("return Modernizr.inputtypes.number");

    }

    public boolean doesBrowserSupportColorInputTypes() {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        return (Boolean) js.executeScript("return Modernizr.inputtypes.color");

    }

    public void waitForScreenUpdate(int timeInMiliis) {
        try {
            Thread.sleep(timeInMiliis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}