import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Root } from "./routes/Root/Root.jsx";
import { Glavnaya } from "./routes/Glavnaya/Glavnaya.jsx";
import { Result } from "./routes/Results/Result.jsx";
import { Form } from "./routes/Form/Form.jsx";
import { Car } from "./routes/Car/[id]/Car.jsx";
import { AllCars } from './routes/AllCars/AllCars.jsx'
import { Profile } from "./components/Profile.jsx";
import { MyOrders } from "./components/MyOrders.jsx";
import { AdminPanel } from "./components/AdminPanel.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { PrivateRoute } from "./components/PrivateRoute.jsx";
import { AdminRoute } from "./components/AdminRoute.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Glavnaya /> },
      { path: '/result', element: <Result /> },
      { path: '/form', element: <Form /> },
      { path: '/cars', element: <AllCars /> },
      { path: '/car/:id', element: <Car /> },
      { path: '/profile', element: <PrivateRoute><Profile /></PrivateRoute> },
      { path: '/my-orders', element: <PrivateRoute><MyOrders /></PrivateRoute> },
      { path: '/admin', element: <AdminRoute><AdminPanel /></AdminRoute> }
    ]
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;