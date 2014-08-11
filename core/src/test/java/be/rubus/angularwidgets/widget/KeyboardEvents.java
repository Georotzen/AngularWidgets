package be.rubus.angularwidgets.widget;

import java.awt.*;

public final class KeyboardEvents {

    private KeyboardEvents() {
    }

    public static void performKeyStrokes(Integer... keys) throws AWTException {

        Robot robot = new Robot();
        for (Integer key : keys) {
            robot.keyPress(key);
            robot.keyRelease(key);
        }
    }
}
