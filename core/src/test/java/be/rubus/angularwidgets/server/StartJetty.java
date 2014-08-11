package be.rubus.angularwidgets.server;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;


public class StartJetty {

    public static void main(String[] args) throws Exception {
        Server server = new Server(8080);

        WebAppContext wac = new WebAppContext();
        wac.setResourceBase("./target/angularwidgets-0.1");  // TODO this needs manual change if we increase version number
        wac.setDescriptor("WEB-INF/web.xml");
        wac.setContextPath("/angularWidgets");
        wac.setParentLoaderPriority(true);
        server.setHandler(wac);

        server.start();
        server.join();
    }
}
