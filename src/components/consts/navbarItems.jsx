

import HomeIcon from '@mui/icons-material/Home';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BarChartIcon from '@mui/icons-material/BarChart';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import NewspaperIcon from '@mui/icons-material/Newspaper';
export const mainNavbarItems = [
    {
        id: 0,
        icon: <HomeIcon/>,
        label: 'Home',
        route: 'home',
    },
    {
        id: 1,
        icon: <CurrencyPoundIcon sx={{color:"success"}}/>,
        label: 'Income Tracker',
        route: 'income',
    },
    {
        id: 2,
        icon: <ReceiptIcon variant="secondary"/>,
        label: 'Expense Tracker',
        route: 'expense',
    },
    {
        id: 3,
        icon: <BarChartIcon />,
        label: '50-30-20 Results',
        route: 'strategy',
    },
    {
        id: 4,
        icon: <SportsScoreIcon />,
        label: 'Goal Tracker',
        route: 'goal',
    },
    {
        id: 5,
        icon: <NewspaperIcon />,
        label: 'Why Budgeting?',
        route: 'article',
    },
    
]