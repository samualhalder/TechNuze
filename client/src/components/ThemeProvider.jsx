import { useSelector } from "react-redux";

function ThemeProvider({ children }) {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className={theme}>
      <div className="bg-white text-gray-800 dark:bg-[rgb(16,23,42)] dark:text-gray-200 min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default ThemeProvider;
