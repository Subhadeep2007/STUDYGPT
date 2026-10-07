
import AppRoutes from "./routes/AppRoutes.jsx";
import { Toaster } from "sonner";


const App = () => {
    return (
        <>
            <Toaster
                position="top-right"
                richColors
                closeButton
            />
            <AppRoutes />
        </>
    );
};


export default App;
