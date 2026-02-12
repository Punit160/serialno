export const MenuList = [
    //Dashboard
    {
        title: 'Dashboard',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-025-dashboard"></i>,
        content: [
            {
                title: 'Dashboard Light',
                to: 'dashboard',
            },
            {
                title: 'Dashboard Dark',
                to: 'dashboard-dark',
            },
            // {
            //     title: 'Dashboard 3',
            //     to: 'index-3',
            // },
            // {
            //     title: 'Dashboard 4',
            //     to: 'index-4',
            // },
            // {
            //     title: 'Dashboard 5',
            //     to: 'index-5',
            // },
            // {
            //     title: 'Dashboard 6',
            //     to: 'index-6',
            // },
            // {
            //     title: 'Dashboard 7',
            //     to: 'index-7',
            // },
            // {
            //     title: 'Dashboard 8',
            //     to: 'index-8',
            // },
            // {
            //     title: 'My Wallet',
            //     to: 'my-wallet',
            // },
            // {
            //     title: 'Invoices',
            //     to: 'invoices',
            // },

            // {
            //     title: 'Cards Center',
            //     to: 'cards-center',
            // },
            // {
            //     title: 'Transaction',
            //     to: 'transaction-history',
            // },

            // {
            //     title: 'Transaction Details',
            //     to: 'transaction-details',
            // },
        ],
    },


// Panel Generation
{
    title: 'Panel Generation',
    classsChange: 'mm-collapse',
    iconStyle: <i className="fa-solid fa-solar-panel fw-bold" />,
    content: [
        {
            title: 'Generate Panel',
            to: 'panel/generate',
        },
        {
            title: 'View Panel List',
            to: 'generate/panel/list',
        },
    ],
},


// Dispatch Panel
{
    title: "Dispatch Panel",
    classsChange: 'mm-collapse',
    iconStyle: <i className="fa-solid fa-truck-fast fw-bold" />,
    content: [
        {
            title: 'Dispatch Panel',
            to: '/dispatch/create',
        },
        {
            title: 'View Dispatch List',
            to: '/dispatch/list',
        },
    ],
},




// Damage Panel
{
    title: "Damage Panel",
    classsChange: 'mm-collapse',
    iconStyle: <i className="fa-solid fa-triangle-exclamation fw-bold" />,
    content: [
        {
            title: 'Sender Damage Report',
            to: 'sender/damage/create',
        },
           {
            title: 'Receiver Damage Report',
            to: 'receiver/damage/create',
        },
        {
            title: 'View Damage List',
            to: '/damage/list',
        },
    ],
},



// User Management
{
    title: "User Management",
    classsChange: 'mm-collapse',
    iconStyle: <i className="fa-solid fa-users fw-bold" />,
    content: [
        {
            title: 'Add User',
            to: '/user/add',
        },
        {
            title: 'View Users',
            to: '/user/list',
        },
    ],
},




]