import DashboardLayout from "./layout/DashboardLayout";
import AppRouter from "./routes/Router";
import { NotificationProvider } from "./notifications/NotificationProvider";
import "./index.css";

const App = () => {
  return (
    <NotificationProvider>
      <DashboardLayout>
        <AppRouter />
      </DashboardLayout>
    </NotificationProvider>
  );
};

export default App;