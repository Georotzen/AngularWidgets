package be.rubus.angularwidgets.widget;

import be.rubus.web.testing.widget.extension.angularwidgets.AbstractAngularWidgetsWidget;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

public class WidgetSelection extends AbstractAngularWidgetsWidget {

    public int getWidgetCount() {
        return root.findElements(By.className("widgetSelection")).size();
    }

    public String getWidgetName(int idx) {
        List<WebElement> widgets = root.findElements(By.className("widgetSelection"));
        return widgets.get(idx).getText();

    }

    public void selectWidget(int idx) {
        List<WebElement> widgets = root.findElements(By.className("widgetSelection"));
        widgets.get(idx).click();
        presenceOfElementLocated(By.id("widgetSubPages"));
    }

}
