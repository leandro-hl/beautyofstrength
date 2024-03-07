import './App.css';
import {createBrowserRouter, Link, Route, Router, RouterProvider, Routes} from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import {Box, Grid} from "@mui/material";
import {DashboardPage} from "./components/DashboardPage";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: DashboardPage,
        }
    ]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: "linear-gradient(180deg, #0C0C0C 0%, rgba(85, 85, 86, 0.97) 100%)"
            }}
        >
            <Grid container>
                <CssBaseline />
                <RouterProvider router={router} />
            </Grid>
        </Box>
    )
}

export default App;
