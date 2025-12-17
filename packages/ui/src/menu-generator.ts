import {
  LineChart,
  User,
  List,
  LayoutGrid,
  Users,
  Box,
  HelpCircle,
  UserSquare,
  AlignRight,
  Network,
  Asterisk,
  Settings,
  BookOpen,
  Calendar,
  Ticket,
  Database,
  Dices,
  HandCoins,
  GanttChart,
  // FunnelDollar,
  // BadgeDollar,
  ListOrdered,
  Warehouse,
  Projector,
  // Tool,
  CheckCircle,
  RefreshCw,
  Map,
  Briefcase,
  Globe,
  Folder,
  Lock,
  Palette,
  Layers,
  // Medical,
  // Tabs,
  Book,
  Signal,
  Landmark,
  ScrollText,
  CalendarDays,
  Rocket,
  Star,
  CircleDollarSign,
  Shapes,
} from 'lucide-react';

interface MenuItem {
  label: string;
  permission?: string;
  icon?: React.ComponentType<{ className?: string }>;
  path?: string;
  children?: MenuItem[];
}

export const generateFullMenu = (): {
  name: string;
  displayName: string;
  items: MenuItem[];
} => ({
  name: 'MainMenu',
  displayName: 'MainMenu',
  items: [
    {
      label: 'Dashboard',
      permission: 'Pages.Administration.Host.Dashboard',
      icon: LineChart,
      path: '/admin/hostDashboard',
    },
    {
      label: 'Dashboard',
      permission: 'Pages.Tenant.Dashboard',
      icon: LineChart,
      path: '/main/dashboard',
    },
    {
      label: 'Tenants',
      permission: 'Pages.Tenants',
      icon: List,
      path: '/admin/tenants',
    },
    {
      label: 'Editions',
      permission: 'Pages.Editions',
      icon: LayoutGrid,
      path: '/admin/editions',
    },
    {
      label: 'Customer Profile',
      icon: User,
      children: [
        {
          label: 'Personal',
          permission: 'Pages.Personals',
          icon: Users,
          path: '/main/views/customers/personals',
        },
        {
          label: 'InTrustFor',
          icon: Box,
          children: [
            {
              label: 'InTrustFor',
              permission: 'Pages.InTrustFors',
              icon: HelpCircle,
              path: '/main/views/customers/in-trus-for',
            },
            {
              label: 'Trustees',
              permission: 'Pages.Trustees',
              icon: Box,
              path: '/main/views/customers/trustees',
            },
          ],
        },
        {
          label: 'Corporates',
          icon: GanttChart,
          children: [
            {
              label: 'Corporates',
              permission: 'Pages.Corporates',
              icon: GanttChart,
              path: '/main/views/customers/corporate',
            },
            {
              label: 'Directors',
              permission: 'Pages.Directors',
              icon: UserSquare,
              path: '/main/views/customers/directors',
            },
            {
              label: 'Signatories',
              permission: 'Pages.Signatories',
              icon: AlignRight,
              path: '/main/views/accounts/signatories',
            },
          ],
        },
        {
          label: 'Groups',
          permission: 'Pages.Groups',
          icon: Network,
          path: '/main/views/customers/groups',
        },
        {
          label: 'Joint',
          icon: Asterisk,
          path: '/main/views/customers/joint',
        },
      ],
    },
    {
      label: 'Accounts Management',
      icon: Settings,
      children: [
        {
          label: 'Accounts',
          permission: 'Pages.Accounts',
          icon: LayoutGrid,
          path: '/main/views/accounts/accounts',
        },
        {
          label: 'Liens',
          permission: 'Pages.Liens',
          icon: BookOpen,
          path: '/main/views/accounts/liens',
        },
        {
          label: 'Overdrafts',
          permission: 'Pages.Overdrafts',
          icon: Calendar,
          path: '/main/views/accounts/over-drafts',
        },
        {
          label: 'Cheques Management',
          icon: Ticket,
          children: [
            {
              label: 'Cheques',
              permission: 'Pages.Cheques',
              icon: Ticket,
              path: '/main/views/accounts/cheques',
            },
            {
              label: 'Cheque Books',
              permission: 'Pages.ChequeBooks',
              icon: Ticket,
              path: '/main/views/accounts/cheque-books',
            },
          ],
        },
      ],
    },
    {
      label: 'Investments',
      icon: HandCoins,
      children: [
        {
          label: 'Process Investment',
          permission: 'Pages.Investments',
          icon: HandCoins,
          path: '/main/views/finance/investments',
        },
        {
          label: 'Manage Investment',
          permission: 'Pages.Investments',
          icon: HandCoins,
          path: '/main/views/finance/manageInvestment',
        },
      ],
    },
    {
      label: 'Teller',
      icon: CircleDollarSign,
      children: [
        {
          label: 'Payments',
          icon: CircleDollarSign,
          path: '/main/views/teller/Payments',
        },
        {
          label: 'Voucher',
          icon: Ticket,
          path: '/main/views/teller/Voucher',
        },
        {
          label: 'Daybook',
          icon: Book,
          path: '/main/views/teller/Daybook',
        },
        {
          label: 'Teller Summary',
          icon: Book,
          path: '/main/views/teller/Cashbook',
        },
      ],
    },
    {
      label: 'Loan Management',
      icon: ScrollText,
      children: [
        {
          label: 'Process Loans',
          permission: 'Pages.Loans',
          icon: Database,
          path: '/main/views/credits/loans',
        },
        {
          label: 'Disburse Loans',
          permission: 'Pages.LoanSchedules',
          icon: Dices,
          path: '/main/views/credits/disburseLoan',
        },
        {
          label: 'Manage Loans',
          permission: 'Pages.Guarantors',
          icon: HandCoins,
          path: '/main/views/credits/viewLoan',
        },
      ],
    },
    {
      label: 'Finance',
      icon: Landmark,
      children: [
        {
          label: 'Placements',
          icon: GanttChart,
          children: [
            {
              label: 'Process Placements',
              icon: GanttChart,
              path: '/main/views/finance/placements',
            },
            {
              label: 'Manage Placements',
              icon: GanttChart,
              path: '/main/views/finance/ManagePlacement',
            },
          ],
        },
        {
          label: 'Borrowings',
          // icon: FunnelDollar,
          children: [
            {
              label: 'Process Borrowings',
              // icon: FunnelDollar,
              path: '/main/views/finance/borrowings',
            },
            {
              label: 'Manage Borrowings',
              // icon: FunnelDollar,
              path: '/main/views/finance/ManageBorrowing',
            },
          ],
        },
        {
          label: 'Journal Batch',
          // icon: BadgeDollar,
          path: '/main/views/finance/nominal-batch',
        },
        {
          label: 'Reports',
          icon: Landmark,
          children: [
            {
              label: 'Cashbook Summary',
              icon: ListOrdered,
              path: '/main/views/finance/nominal-enquiry',
            },
            {
              label: 'Ledger Enquiry',
              icon: ListOrdered,
              path: '/main/views/finance/nominal-enquiry',
            },
            {
              label: 'Trial Balance',
              icon: ListOrdered,
              path: '/main/views/finance/trialBalance',
            },
          ],
        },
        {
          label: 'Asset Register',
          permission: 'Pages.AssetRegistries',
          icon: Warehouse,
          path: '/main/views/finance/asset-registries',
        },
        {
          label: 'Chart of Account',
          permission: 'Pages.NominalCodes',
          icon: Book,
          path: '/main/views/finance/nominal-code',
        },
        {
          label: 'Journal Voucher',
          permission: 'Pages.NominalCodes',
          icon: Book,
          path: '/main/views/finance/voucher',
        },
      ],
    },
    {
      label: 'Back Office',
      icon: Projector,
      children: [
        {
          label: 'Account Batch',
          icon: HandCoins,
          path: '/main/views/back-office/accountBatch',
        },
        {
          label: 'Bank Sessions',
          permission: 'Pages.BankSessions',
          icon: BookOpen,
          path: '/main/views/back-office/bank-sessions',
        },
        {
          label: 'Batch Items',
          permission: 'Pages.BatchItems',
          icon: List,
          path: '/main/views/back-office/batch-items',
        },
        {
          label: 'Channel Logs',
          permission: 'Pages.ChannelLogs',
          icon: Warehouse,
          path: '/main/views/back-office/channel-logs',
        },
        {
          label: 'Targets',
          permission: 'Pages.Targets',
          icon: Projector,
          path: '/main/views/back-office/targets',
        },
        {
          label: 'Transactions',
          permission: 'Pages.Transactions',
          // icon: Tool,
          path: '/main/views/back-office/transactions',
        },
      ],
    },
    {
      label: 'Approval',
      icon: CheckCircle,
      children: [
        {
          label: 'Account Batch',
          permission: 'Pages.BankDetails',
          icon: RefreshCw,
          path: '/main/views/approval/AccountBatch',
        },
        {
          label: 'Ledger Batch',
          icon: Book,
          path: '/main/views/approval/NominalBatch',
        },
        {
          label: 'Account',
          icon: Book,
          children: [
            {
              label: 'Individual',
              icon: Book,
              path: '/main/views/approval/account/approveIndividual',
            },
            {
              label: 'Corporate',
              icon: Book,
              path: '/main/views/approval/account/approveCoporate',
            },
            {
              label: 'In Trust For',
              icon: Book,
              path: '/main/views/approval/account/approveInTrustFor',
            },
            {
              label: 'Group',
              icon: Book,
              path: '/main/views/approval/account/approveGroup',
            },
          ],
        },
        {
          label: 'Loans',
          icon: Book,
          children: [
            {
              label: 'Approve Loan',
              icon: Book,
              path: '/main/views/approval/Credit/loan',
            },
          ],
        },
        {
          label: 'Borrowing',
          permission: 'Pages.BankDetails',
          icon: Book,
          path: '/main/views/approval/Borrowing',
        },
        {
          label: 'Investment',
          permission: 'Pages.BankDetails',
          icon: Book,
          path: '/main/views/approval/Investment',
        },
        {
          label: 'Placement',
          permission: 'Pages.BankDetails',
          icon: Book,
          path: '/main/views/approval/Placement',
        },
      ],
    },
    {
      label: 'System Settings',
      icon: Settings,
      children: [
        {
          label: 'BankDetails',
          permission: 'Pages.BankDetails',
          icon: Book,
          path: '/main/views/settings/bank-details',
        },
        {
          label: 'ApiSetups',
          permission: 'Pages.ApiSetups',
          icon: Globe,
          path: '/main/views/settings/api-setups',
        },
        {
          label: 'Countries',
          permission: 'Pages.Countries',
          // icon: Tabs,
          path: '/main/views/settings/countries',
        },
        {
          label: 'Regions',
          permission: 'Pages.Regions',
          // icon: Medical,
          path: '/main/views/settings/regions',
        },
        {
          label: 'Cities',
          permission: 'Pages.Cities',
          icon: RefreshCw,
          path: '/main/views/settings/cities',
        },
        {
          label: 'IDTypes',
          permission: 'Pages.IDTypes',
          icon: Globe,
          path: '/main/views/settings/id-types',
        },
        {
          label: 'Holiday',
          icon: CalendarDays,
          path: '/main/views/settings/holiday',
        },
        {
          label: 'LoanInterestType',
          icon: CalendarDays,
          path: '/main/views/settings/loanInterestType',
        },
        {
          label: 'Occupations',
          permission: 'Pages.Occupations',
          icon: User,
          path: '/main/views/settings/occupations',
        },
        {
          label: 'FiscalYears',
          permission: 'Pages.FiscalYears',
          icon: Calendar,
          path: '/main/views/settings/fiscal-years',
        },
        {
          label: 'CollateralTypes',
          permission: 'Pages.CollateralTypes',
          icon: Rocket,
          path: '/main/views/settings/collateral-types',
        },
        {
          label: 'Sequences',
          permission: 'Pages.Sequences',
          icon: Book,
          path: '/main/views/settings/sequences',
        },
        {
          label: 'Currencies',
          permission: 'Pages.Currencies',
          icon: CircleDollarSign,
          path: '/main/views/settings/currencies',
        },
        {
          label: 'SystemKeys',
          permission: 'Pages.SystemKeys',
          icon: Layers,
          path: '/main/views/settings/system-keys',
        },
        {
          label: 'Teller Manager',
          icon: Layers,
          path: '/main/views/settings/TellerManager',
        },
        {
          label: 'Ratings',
          permission: 'Pages.Ratings',
          icon: Star,
          path: '/main/views/settings/ratings',
        },
        {
          label: 'ChargeSetups',
          permission: 'Pages.ChargeSetups',
          icon: Signal,
          path: '/main/views/settings/charge-setups',
        },
        {
          label: 'AccountTypes',
          permission: 'Pages.AccountTypes',
          icon: Landmark,
          path: '/main/views/settings/account-types',
        },
        {
          label: 'LoanTypes',
          permission: 'Pages.LoanTypes',
          icon: ScrollText,
          path: '/main/views/settings/loan-types',
        },
        {
          label: 'Sectors',
          permission: 'Pages.Sectors',
          icon: Projector,
          path: '/main/views/settings/sectors',
        },
        {
          label: 'RelationOfficers',
          permission: 'Pages.RelationOfficers',
          icon: User,
          path: '/main/views/settings/relation-offices',
        },
        {
          label: 'ChannelUsers',
          permission: 'Pages.ChannelUsers',
          icon: Users,
          path: '/main/views/settings/channel-users',
        },
        {
          label: 'AssetClassSetups',
          permission: 'Pages.AssetClassSetups',
          icon: Warehouse,
          path: '/main/views/settings/asset-class-setups',
        },
        {
          label: 'CustomReportTypes',
          permission: 'Pages.CustomReportTypes',
          // icon: Medical,
          path: '/main/views/settings/custom-report-types',
        },
        {
          label: 'CustomReportItems',
          permission: 'Pages.CustomReportItems',
          icon: GanttChart,
          path: '/main/views/settings/custom-report-items',
        },
        {
          label: 'CustomReportHeadings',
          permission: 'Pages.CustomReportHeadings',
          icon: Book,
          path: '/main/views/settings/custom-report-headings',
        },
        {
          label: 'TaxSetups',
          permission: 'Pages.TaxSetups',
          icon: Book,
          path: '/app/main/banking/taxSetups',
        },
      ],
    },
    {
      label: 'Migration',
      icon: Settings,
      children: [
        {
          label: 'Customer',
          permission: 'Pages.BankDetails',
          icon: Book,
          path: '/app/main/banking/bankDetails',
        },
        {
          label: 'Account',
          permission: 'Pages.BankDetails',
          icon: Book,
          path: '/app/main/banking/bankDetails',
        },
        {
          label: 'Credit',
          permission: 'Pages.BankDetails',
          icon: Book,
          path: '/app/main/banking/bankDetails',
        },
        {
          label: 'Chart of Accounts',
          permission: 'Pages.BankDetails',
          icon: Book,
          path: '/app/main/banking/bankDetails',
        },
      ],
    },
    {
      label: 'Administration',
      icon: Settings,
      children: [
        {
          label: 'OrganizationUnits',
          permission: 'Pages.Administration.OrganizationUnits',
          icon: Map,
          path: '/app/admin/organization-units',
        },
        {
          label: 'Roles',
          permission: 'Pages.Administration.Roles',
          icon: Briefcase,
          path: '/app/admin/roles',
        },
        {
          label: 'Users',
          permission: 'Pages.Administration.Users',
          icon: Users,
          path: '/app/admin/users',
        },
        {
          label: 'Languages',
          permission: 'Pages.Administration.Languages',
          icon: Globe,
          path: '/app/admin/languages',
        },
        {
          label: 'AuditLogs',
          permission: 'Pages.Administration.AuditLogs',
          icon: Book,
          path: '/app/admin/auditLogs',
        },
        {
          label: 'Maintenance',
          permission: 'Pages.Administration.Host.Maintenance',
          icon: Lock,
          path: '/app/admin/maintenance',
        },
        {
          label: 'Subscription',
          permission: 'Pages.Administration.Tenant.SubscriptionManagement',
          icon: RefreshCw,
          path: '/app/admin/subscription-management',
        },
        {
          label: 'VisualSettings',
          permission: 'Pages.Administration.UiCustomization',
          icon: Palette,
          path: '/app/admin/ui-customization',
        },
        {
          label: 'WebhookSubscriptions',
          permission: 'Pages.Administration.WebhookSubscription',
          icon: Globe,
          path: '/app/admin/webhook-subscriptions',
        },
        {
          label: 'DynamicProperties',
          permission: 'Pages.Administration.DynamicProperties',
          icon: Layers,
          path: '/app/admin/dynamic-property',
        },
        {
          label: 'Settings',
          permission: 'Pages.Administration.Host.Settings',
          icon: Settings,
          path: '/app/admin/hostSettings',
        },
        {
          label: 'Settings',
          permission: 'Pages.Administration.Tenant.Settings',
          icon: Settings,
          path: '/app/admin/tenantSettings',
        },
      ],
    },
    {
      label: 'DemoUiComponents',
      permission: 'Pages.DemoUiComponents',
      icon: Shapes,
      path: '/app/admin/demo-ui-components',
    },
  ],
});
