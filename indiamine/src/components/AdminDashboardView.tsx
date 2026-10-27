// import React, { useMemo, useState } from 'react';
// import {
//   LayoutDashboard,
//   Users,
//   Clapperboard,
//   ClipboardCheck,
//   Flag,
//   Settings,
//   Search,
//   Bell,
//   ChevronDown,
//   ChevronRight,
//   Menu,
//   X,
//   ShieldCheck,
//   TrendingUp,
//   Eye,
//   Clock3,
//   CheckCircle2,
//   XCircle,
//   MoreHorizontal,
//   Plus,
//   Download,
//   Filter,
//   Activity,
//   ArrowUpRight,
//   Film,
//   UserCheck,
//   AlertTriangle,
//   Database,
//   LockKeyhole,
//   Globe,
//   Save,
//   RefreshCw,
// } from 'lucide-react';

// type AdminTab =
//   | 'overview'
//   | 'users'
//   | 'content'
//   | 'submissions'
//   | 'reports'
//   | 'settings';

// const NAV_ITEMS: {
//   id: AdminTab;
//   label: string;
//   icon: React.ElementType;
// }[] = [
//     { id: 'overview', label: 'Overview', icon: LayoutDashboard },
//     { id: 'users', label: 'Users & Creators', icon: Users },
//     { id: 'content', label: 'Content Management', icon: Clapperboard },
//     { id: 'submissions', label: 'Submissions', icon: ClipboardCheck },
//     { id: 'reports', label: 'Reports', icon: Flag },
//     { id: 'settings', label: 'Settings', icon: Settings },
//   ];

// // Temporary sample data for the dashboard UI.
// // Replace with Supabase queries before production use.
// const SAMPLE_USERS = [
//   { id: 'USR-001', name: 'Arjun Sharma', email: 'arjun@example.com', role: 'Viewer', status: 'Active', joined: 'Oct 26, 2026' },
//   { id: 'USR-002', name: 'Aarya Mehta', email: 'aarya@example.com', role: 'Creator', status: 'Active', joined: 'Oct 25, 2026' },
//   { id: 'USR-003', name: 'Rohan Patel', email: 'rohan@example.com', role: 'Viewer', status: 'Active', joined: 'Oct 24, 2026' },
//   { id: 'USR-004', name: 'Priya Singh', email: 'priya@example.com', role: 'Creator', status: 'Pending', joined: 'Oct 23, 2026' },
//   { id: 'USR-005', name: 'Kabir Verma', email: 'kabir@example.com', role: 'Viewer', status: 'Suspended', joined: 'Oct 21, 2026' },
// ];

// const SAMPLE_CONTENT = [
//   { id: 'ANI-001', title: 'Solo Leveling', genre: 'Action, Fantasy', type: 'Series', status: 'Published', views: '24.8K' },
//   { id: 'ANI-002', title: 'Demon Slayer', genre: 'Action, Adventure', type: 'Series', status: 'Published', views: '18.2K' },
//   { id: 'ANI-003', title: 'The Silent Horizon', genre: 'Drama, Mystery', type: 'Movie', status: 'Review', views: '—' },
//   { id: 'ANI-004', title: 'Beyond the Stars', genre: 'Sci-Fi, Fantasy', type: 'Series', status: 'Draft', views: '—' },
// ];

// const SAMPLE_SUBMISSIONS = [
//   { id: 'SUB-101', title: 'The Silent Horizon', creator: 'Priya Singh', submitted: '2 hours ago', type: 'Movie' },
//   { id: 'SUB-102', title: 'Beyond the Stars', creator: 'Aarya Mehta', submitted: '5 hours ago', type: 'Series' },
//   { id: 'SUB-103', title: 'Crimson Moon', creator: 'Dev Kapoor', submitted: 'Yesterday', type: 'Series' },
// ];

// const SAMPLE_REPORTS = [
//   { id: 'REP-201', subject: 'Incorrect content information', target: 'Solo Leveling', reporter: 'User #1042', priority: 'Medium', status: 'Open' },
//   { id: 'REP-202', subject: 'Copyright concern', target: 'Crimson Moon', reporter: 'User #1081', priority: 'High', status: 'Open' },
//   { id: 'REP-203', subject: 'Inappropriate community post', target: 'Community post #88', reporter: 'User #1104', priority: 'Low', status: 'Reviewing' },
// ];

// function StatusBadge({ status }: { status: string }) {
//   const styles: Record<string, string> = {
//     Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
//     Published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
//     Approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
//     Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
//     Review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
//     Reviewing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
//     Draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
//     Suspended: 'bg-red-500/10 text-red-400 border-red-500/20',
//     Rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
//     Open: 'bg-red-500/10 text-red-400 border-red-500/20',
//   };

//   return (
//     <span
//       className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status] || 'bg-white/5 text-slate-300 border-white/10'
//         }`}
//     >
//       <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
//       {status}
//     </span>
//   );
// }

// function StatCard({
//   title,
//   value,
//   change,
//   icon: Icon,
//   accent,
// }: {
//   title: string;
//   value: string;
//   change: string;
//   icon: React.ElementType;
//   accent: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-white/[0.08] bg-[#191b24] p-5 transition-colors hover:border-white/15">
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <p className="text-sm text-slate-400">{title}</p>
//           <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
//             {value}
//           </h3>
//         </div>
//         <div className={`rounded-xl p-3 ${accent}`}>
//           <Icon size={21} />
//         </div>
//       </div>
//       <div className="mt-4 flex items-center gap-1.5 text-xs">
//         <TrendingUp size={14} className="text-emerald-400" />
//         <span className="font-semibold text-emerald-400">{change}</span>
//         <span className="text-slate-500">sample dashboard metric</span>
//       </div>
//     </div>
//   );
// }

// function SectionHeading({
//   title,
//   description,
//   children,
// }: {
//   title: string;
//   description: string;
//   children?: React.ReactNode;
// }) {
//   return (
//     <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//       <div>
//         <h2 className="text-xl font-bold text-white">{title}</h2>
//         <p className="mt-1 text-sm text-slate-400">{description}</p>
//       </div>
//       {children && (
//         <div className="flex flex-wrap items-center gap-2">{children}</div>
//       )}
//     </div>
//   );
// }

// function EmptyNotice({ text }: { text: string }) {
//   return (
//     <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-400">
//       {text}
//     </div>
//   );
// }

// export default function AdminDashboardView() {
//   const [activeTab, setActiveTab] = useState<AdminTab>('overview');
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [search, setSearch] = useState('');
//   const [userFilter, setUserFilter] = useState('All');
//   const [notice, setNotice] = useState('');
//   const [settings, setSettings] = useState({
//     maintenanceMode: false,
//     allowCreatorSubmissions: true,
//     communityEnabled: true,
//   });

//   const filteredUsers = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     return SAMPLE_USERS.filter((user) => {
//       const matchesQuery =
//         !query ||
//         user.name.toLowerCase().includes(query) ||
//         user.email.toLowerCase().includes(query) ||
//         user.id.toLowerCase().includes(query);

//       const matchesRole =
//         userFilter === 'All' || user.role === userFilter;

//       return matchesQuery && matchesRole;
//     });
//   }, [search, userFilter]);

//   const filteredContent = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     return SAMPLE_CONTENT.filter(
//       (item) =>
//         !query ||
//         item.title.toLowerCase().includes(query) ||
//         item.genre.toLowerCase().includes(query),
//     );
//   }, [search]);

//   const filteredReports = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     return SAMPLE_REPORTS.filter(
//       (item) =>
//         !query ||
//         item.subject.toLowerCase().includes(query) ||
//         item.target.toLowerCase().includes(query) ||
//         item.id.toLowerCase().includes(query),
//     );
//   }, [search]);

//   const navigate = (tab: AdminTab) => {
//     setActiveTab(tab);
//     setSearch('');
//     setNotice('');
//     setMobileSidebarOpen(false);
//   };

//   // This is UI feedback only. Real moderation actions need database APIs.
//   const showDemoNotice = (message: string) => {
//     setNotice(`${message} Demo mode: no database changes were made.`);
//   };

//   const pageTitles: Record<AdminTab, string> = {
//     overview: 'Dashboard Overview',
//     users: 'Users & Creators',
//     content: 'Content Management',
//     submissions: 'Creator Submissions',
//     reports: 'Reports & Moderation',
//     settings: 'Platform Settings',
//   };

//   const pageDescriptions: Record<AdminTab, string> = {
//     overview: 'Monitor platform activity and review key metrics.',
//     users: 'Review user accounts and creator profiles.',
//     content: 'Manage anime listings and publication status.',
//     submissions: 'Review content submitted by creators.',
//     reports: 'Review reports and moderation requests.',
//     settings: 'Configure platform preferences.',
//   };

//   const renderOverview = () => (
//     <>
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           title="Total Users"
//           value="12,840"
//           change="+12.8%"
//           icon={Users}
//           accent="bg-orange-500/10 text-orange-400"
//         />
//         <StatCard
//           title="Published Anime"
//           value="486"
//           change="+8.2%"
//           icon={Clapperboard}
//           accent="bg-violet-500/10 text-violet-400"
//         />
//         <StatCard
//           title="Pending Submissions"
//           value="18"
//           change="Needs review"
//           icon={ClipboardCheck}
//           accent="bg-amber-500/10 text-amber-400"
//         />
//         <StatCard
//           title="Open Reports"
//           value="07"
//           change="Needs attention"
//           icon={Flag}
//           accent="bg-red-500/10 text-red-400"
//         />
//       </div>

//       <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
//         <section className="rounded-2xl border border-white/[0.08] bg-[#191b24] p-5 lg:col-span-2">
//           <div className="flex items-center justify-between gap-3">
//             <div>
//               <h3 className="font-semibold text-white">Platform Activity</h3>
//               <p className="mt-1 text-xs text-slate-400">
//                 Illustrative weekly activity
//               </p>
//             </div>
//             <span className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300">
//               Last 7 days
//             </span>
//           </div>

//           <div className="mt-8 flex h-52 items-end justify-between gap-3">
//             {[
//               { day: 'Mon', height: '42%' },
//               { day: 'Tue', height: '60%' },
//               { day: 'Wed', height: '48%' },
//               { day: 'Thu', height: '75%' },
//               { day: 'Fri', height: '57%' },
//               { day: 'Sat', height: '90%' },
//               { day: 'Sun', height: '68%' },
//             ].map((item) => (
//               <div
//                 key={item.day}
//                 className="flex h-full flex-1 flex-col items-center justify-end gap-3"
//               >
//                 <div className="flex h-full w-full items-end justify-center">
//                   <div
//                     title={`${item.day}: illustrative activity`}
//                     style={{ height: item.height }}
//                     className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-orange-600 to-orange-400 opacity-80 transition-opacity hover:opacity-100"
//                   />
//                 </div>
//                 <span className="text-xs text-slate-500">{item.day}</span>
//               </div>
//             ))}
//           </div>
//           <p className="mt-5 text-xs text-slate-500">
//             Example visualization only. Replace with real analytics data.
//           </p>
//         </section>

//         <section className="rounded-2xl border border-white/[0.08] bg-[#191b24] p-5">
//           <div className="flex items-center justify-between">
//             <h3 className="font-semibold text-white">Needs Attention</h3>
//             <Activity size={18} className="text-orange-400" />
//           </div>

//           <div className="mt-5 space-y-3">
//             <button
//               onClick={() => navigate('submissions')}
//               className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-colors hover:bg-white/[0.05]"
//             >
//               <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
//                 <Clock3 size={18} />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <p className="text-sm font-medium text-white">
//                   Pending submissions
//                 </p>
//                 <p className="mt-1 text-xs text-slate-400">
//                   18 items awaiting review
//                 </p>
//               </div>
//               <ChevronRight size={16} className="text-slate-500" />
//             </button>

//             <button
//               onClick={() => navigate('reports')}
//               className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-colors hover:bg-white/[0.05]"
//             >
//               <div className="rounded-lg bg-red-500/10 p-2 text-red-400">
//                 <AlertTriangle size={18} />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <p className="text-sm font-medium text-white">Open reports</p>
//                 <p className="mt-1 text-xs text-slate-400">
//                   7 reports need attention
//                 </p>
//               </div>
//               <ChevronRight size={16} className="text-slate-500" />
//             </button>

//             <button
//               onClick={() => navigate('users')}
//               className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-colors hover:bg-white/[0.05]"
//             >
//               <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
//                 <UserCheck size={18} />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <p className="text-sm font-medium text-white">
//                   Creator applications
//                 </p>
//                 <p className="mt-1 text-xs text-slate-400">
//                   Review creator accounts
//                 </p>
//               </div>
//               <ChevronRight size={16} className="text-slate-500" />
//             </button>
//           </div>
//         </section>
//       </div>

//       <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#191b24] p-5">
//         <SectionHeading
//           title="Recent Users"
//           description="Example accounts for the dashboard preview."
//         >
//           <button
//             onClick={() => navigate('users')}
//             className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5"
//           >
//             View all <ArrowUpRight size={15} />
//           </button>
//         </SectionHeading>

//         <UserTable users={SAMPLE_USERS.slice(0, 4)} />
//       </section>
//     </>
//   );

//   const renderUsers = () => (
//     <section className="rounded-2xl border border-white/[0.08] bg-[#191b24] p-5">
//       <SectionHeading
//         title="All Accounts"
//         description={`${filteredUsers.length} sample accounts shown`}
//       >
//         <select
//           value={userFilter}
//           onChange={(event) => setUserFilter(event.target.value)}
//           className="rounded-lg border border-white/10 bg-[#11131c] px-3 py-2 text-sm text-slate-300 outline-none focus:border-orange-500/50"
//         >
//           <option>All</option>
//           <option>Viewer</option>
//           <option>Creator</option>
//         </select>
//         <button
//           onClick={() => showDemoNotice('Export requested.')}
//           className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
//         >
//           <Download size={15} /> Export
//         </button>
//       </SectionHeading>

//       <UserTable users={filteredUsers} onAction={showDemoNotice} />
//     </section>
//   );

//   const renderContent = () => (
//     <section className="rounded-2xl border border-white/[0.08] bg-[#191b24] p-5">
//       <SectionHeading
//         title="Anime Library"
//         description={`${filteredContent.length} sample titles shown`}
//       >
//         <button
//           onClick={() =>
//             showDemoNotice('Add content requested.')
//           }
//           className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
//         >
//           <Plus size={16} /> Add Content
//         </button>
//       </SectionHeading>

//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[650px] text-left text-sm">
//           <thead>
//             <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-slate-500">
//               <th className="pb-4 pr-4 font-medium">Title</th>
//               <th className="pb-4 pr-4 font-medium">Genre</th>
//               <th className="pb-4 pr-4 font-medium">Type</th>
//               <th className="pb-4 pr-4 font-medium">Views</th>
//               <th className="pb-4 pr-4 font-medium">Status</th>
//               <th className="pb-4 text-right font-medium">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredContent.map((item) => (
//               <tr key={item.id} className="border-b border-white/[0.05] last:border-0">
//                 <td className="py-4 pr-4">
//                   <div className="font-medium text-white">{item.title}</div>
//                   <div className="mt-1 text-xs text-slate-500">{item.id}</div>
//                 </td>
//                 <td className="py-4 pr-4 text-slate-400">{item.genre}</td>
//                 <td className="py-4 pr-4 text-slate-400">{item.type}</td>
//                 <td className="py-4 pr-4 text-slate-300">{item.views}</td>
//                 <td className="py-4 pr-4"><StatusBadge status={item.status} /></td>
//                 <td className="py-4 text-right">
//                   <button
//                     onClick={() => showDemoNotice(`Edit requested for ${item.title}.`)}
//                     className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
//                     aria-label={`Edit ${item.title}`}
//                   >
//                     <MoreHorizontal size={18} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );

//   const renderSubmissions = () => (
//     <section className="rounded-2xl border border-white/[0.08] bg-[#191b24] p-5">
//       <SectionHeading
//         title="Pending Review"
//         description="Example creator submissions. Decisions are not saved yet."
//       />

//       <div className="space-y-3">
//         {SAMPLE_SUBMISSIONS.map((item) => (
//           <div
//             key={item.id}
//             className="flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 md:flex-row md:items-center"
//           >
//             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
//               <Film size={22} />
//             </div>
//             <div className="min-w-0 flex-1">
//               <h3 className="font-semibold text-white">{item.title}</h3>
//               <p className="mt-1 text-sm text-slate-400">
//                 {item.creator} · {item.type}
//               </p>
//               <p className="mt-1 text-xs text-slate-500">
//                 {item.id} · Submitted {item.submitted}
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() =>
//                   showDemoNotice(`Approval requested for ${item.title}.`)
//                 }
//                 className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20"
//               >
//                 <CheckCircle2 size={16} /> Approve
//               </button>
//               <button
//                 onClick={() =>
//                   showDemoNotice(`Rejection requested for ${item.title}.`)
//                 }
//                 className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
//               >
//                 <XCircle size={16} /> Reject
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );

//   const renderReports = () => (
//     <section className="rounded-2xl border border-white/[0.08] bg-[#191b24] p-5">
//       <SectionHeading
//         title="Reported Items"
//         description="Sample reports for the moderation interface."
//       >
//         <button
//           onClick={() => {
//             setSearch('');
//             showDemoNotice('Report list refreshed.');
//           }}
//           className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
//         >
//           <RefreshCw size={15} /> Refresh
//         </button>
//       </SectionHeading>

//       <div className="space-y-3">
//         {filteredReports.map((report) => (
//           <div
//             key={report.id}
//             className="rounded-xl border border-white/[0.07] p-4"
//           >
//             <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
//               <div>
//                 <div className="flex flex-wrap items-center gap-2">
//                   <h3 className="font-semibold text-white">{report.subject}</h3>
//                   <StatusBadge status={report.status} />
//                 </div>
//                 <p className="mt-2 text-sm text-slate-400">
//                   Target: {report.target}
//                 </p>
//                 <p className="mt-1 text-xs text-slate-500">
//                   {report.id} · Reported by {report.reporter}
//                 </p>
//               </div>
//               <div className="flex flex-wrap items-center gap-2">
//                 <span className={`rounded-full px-2.5 py-1 text-xs ${report.priority === 'High'
//                     ? 'bg-red-500/10 text-red-400'
//                     : report.priority === 'Medium'
//                       ? 'bg-amber-500/10 text-amber-400'
//                       : 'bg-slate-500/10 text-slate-400'
//                   }`}>
//                   {report.priority} priority
//                 </span>
//                 <button
//                   onClick={() =>
//                     showDemoNotice(`Review opened for ${report.id}.`)
//                   }
//                   className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
//                 >
//                   Review
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//         {filteredReports.length === 0 && (
//           <EmptyNotice text="No matching reports found." />
//         )}
//       </div>
//     </section>
//   );

//   const renderSettings = () => (
//     <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
//       <section className="rounded-2xl border border-white/[0.08] bg-[#191b24] p-5">
//         <h3 className="font-semibold text-white">Platform Controls</h3>
//         <p className="mt-1 text-sm text-slate-400">
//           These controls currently affect this screen only.
//         </p>

//         <div className="mt-5 space-y-5">
//           {[
//             {
//               key: 'maintenanceMode' as const,
//               title: 'Maintenance mode',
//               description: 'Display a maintenance state when connected.',
//             },
//             {
//               key: 'allowCreatorSubmissions' as const,
//               title: 'Creator submissions',
//               description: 'Allow creators to submit content.',
//             },
//             {
//               key: 'communityEnabled' as const,
//               title: 'Community features',
//               description: 'Enable community features on the platform.',
//             },
//           ].map((item) => (
//             <div
//               key={item.key}
//               className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-4 last:border-0 last:pb-0"
//             >
//               <div>
//                 <p className="text-sm font-medium text-white">{item.title}</p>
//                 <p className="mt-1 text-xs text-slate-400">{item.description}</p>
//               </div>
//               <button
//                 type="button"
//                 role="switch"
//                 aria-checked={settings[item.key]}
//                 onClick={() =>
//                   setSettings((previous) => ({
//                     ...previous,
//                     [item.key]: !previous[item.key],
//                   }))
//                 }
//                 className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${settings[item.key] ? 'bg-orange-500' : 'bg-slate-700'
//                   }`}
//               >
//                 <span
//                   className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${settings[item.key] ? 'translate-x-6' : 'translate-x-1'
//                     }`}
//                 />
//               </button>
//             </div>
//           ))}
//         </div>

//         <button
//           onClick={() => showDemoNotice('Settings save requested.')}
//           className="mt-6 flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-400"
//         >
//           <Save size={16} /> Save Settings
//         </button>
//       </section>

//       <section className="rounded-2xl border border-white/[0.08] bg-[#191b24] p-5">
//         <h3 className="font-semibold text-white">Security & System</h3>
//         <p className="mt-1 text-sm text-slate-400">
//           Status placeholders until connected to Supabase.
//         </p>

//         <div className="mt-5 space-y-3">
//           {[
//             {
//               icon: ShieldCheck,
//               title: 'Admin authorization',
//               description: 'Must be verified using a trusted database role.',
//               color: 'text-emerald-400 bg-emerald-500/10',
//             },
//             {
//               icon: Database,
//               title: 'Database connection',
//               description: 'Supabase connection status not checked here.',
//               color: 'text-blue-400 bg-blue-500/10',
//             },
//             {
//               icon: LockKeyhole,
//               title: 'Row-level security',
//               description: 'Protected tables require server-side policies.',
//               color: 'text-amber-400 bg-amber-500/10',
//             },
//             {
//               icon: Globe,
//               title: 'Public platform',
//               description: 'Production configuration needs verification.',
//               color: 'text-violet-400 bg-violet-500/10',
//             },
//           ].map((item) => {
//             const Icon = item.icon;
//             return (
//               <div
//                 key={item.title}
//                 className="flex items-start gap-3 rounded-xl border border-white/[0.06] p-3"
//               >
//                 <div className={`rounded-lg p-2 ${item.color}`}>
//                   <Icon size={18} />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-white">{item.title}</p>
//                   <p className="mt-1 text-xs leading-relaxed text-slate-400">
//                     {item.description}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </section>
//     </div>
//   );



//   return (
//     <div className="min-h-screen w-full min-w-0 overflow-x-clip bg-[#11131c] text-slate-200">
//       {mobileSidebarOpen && (
//         <button
//           aria-label="Close sidebar"
//           className="fixed inset-0 z-40 bg-black/70 lg:hidden"
//           onClick={() => setMobileSidebarOpen(false)}
//         />
//       )}

//       <aside
//         className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.08] bg-[#191b24] transition-transform duration-200 lg:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           }`}
//       >
//         <div className="flex h-[76px] items-center justify-between border-b border-white/[0.08] px-5">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
//               <Clapperboard size={23} />
//             </div>
//             <div>
//               <h1 className="text-lg font-bold tracking-tight text-white">
//                 Ani<span className="text-orange-400">Galnexo</span>
//               </h1>
//               <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
//                 Admin Console
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={() => setMobileSidebarOpen(false)}
//             className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden"
//             aria-label="Close navigation"
//           >
//             <X size={19} />
//           </button>
//         </div>

//         <div className="px-4 pt-6">
//           <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
//             Workspace
//           </p>
//           <nav className="space-y-1">
//             {NAV_ITEMS.map((item) => {
//               const Icon = item.icon;
//               const active = activeTab === item.id;

//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => navigate(item.id)}
//                   className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-all ${active
//                       ? 'bg-orange-500/10 font-semibold text-orange-400 ring-1 ring-orange-500/20'
//                       : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
//                     }`}
//                 >
//                   <Icon size={19} />
//                   <span className="flex-1">{item.label}</span>
//                   {item.id === 'submissions' && (
//                     <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
//                       18
//                     </span>
//                   )}
//                   {item.id === 'reports' && (
//                     <span className="rounded-md bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
//                       7
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>

//         <div className="mt-auto p-4">
//           <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
//             <div className="flex items-center gap-2 text-orange-400">
//               <ShieldCheck size={18} />
//               <span className="text-sm font-semibold">Admin workspace</span>
//             </div>
//             <p className="mt-2 text-xs leading-relaxed text-slate-500">
//               Connect verified admin authentication before production use.
//             </p>
//           </div>

//           <div className="mt-4 flex items-center gap-3 border-t border-white/[0.08] pt-4">
//             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/15 font-bold text-orange-400">
//               A
//             </div>
//             <div className="min-w-0 flex-1">
//               <p className="truncate text-sm font-semibold text-white">
//                 Admin Workspace
//               </p>
//               <p className="text-xs text-slate-500">Preview UI</p>
//             </div>
//             <ShieldCheck size={17} className="text-emerald-400" />
//           </div>
//         </div>
//       </aside>

//       <div className="min-h-screen min-w-0 w-full lg:pl-64">
//         <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/[0.08] bg-[#11131c]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
//           <div className="flex min-w-0 items-center gap-3">
//             <button
//               onClick={() => setMobileSidebarOpen(true)}
//               className="rounded-lg p-2 text-slate-300 hover:bg-white/5 lg:hidden"
//               aria-label="Open navigation"
//             >
//               <Menu size={21} />
//             </button>
//             <div className="min-w-0">
//               <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
//                 <span>Admin</span>
//                 <ChevronRight size={13} />
//                 <span className="text-slate-300">{pageTitles[activeTab]}</span>
//               </div>
//               <h2 className="truncate text-lg font-bold text-white sm:mt-1">
//                 {pageTitles[activeTab]}
//               </h2>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 sm:gap-4">
//             <label className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 md:flex">
//               <Search size={16} className="text-slate-500" />
//               <input
//                 value={search}
//                 onChange={(event) => setSearch(event.target.value)}
//                 placeholder="Search this section..."
//                 className="w-40 bg-transparent text-sm text-white outline-none placeholder:text-slate-500 lg:w-52"
//               />
//               {search && (
//                 <button
//                   onClick={() => setSearch('')}
//                   aria-label="Clear search"
//                   className="text-slate-500 hover:text-white"
//                 >
//                   <X size={14} />
//                 </button>
//               )}
//             </label>

//             <button
//               onClick={() => navigate('reports')}
//               className="relative rounded-xl border border-white/[0.08] p-2.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
//               aria-label="View reports"
//             >
//               <Bell size={19} />
//               <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-400 ring-2 ring-[#11131c]" />
//             </button>

//             <div className="hidden h-8 w-px bg-white/10 sm:block" />

//             <div className="hidden items-center gap-2 sm:flex">
//               <span className="text-xs text-slate-400">Administrator</span>
//               <ChevronDown size={15} className="text-slate-500" />
//             </div>
//           </div>
//         </header>

//         <main className="mx-auto w-full min-w-0 max-w-[1600px] p-3 sm:p-5 lg:p-6">
//           <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
//             <div>
//               <p className="text-sm text-slate-400">
//                 {pageDescriptions[activeTab]}
//               </p>
//             </div>
//             <div className="flex items-center gap-2 text-xs text-amber-400">
//               <span className="h-2 w-2 rounded-full bg-amber-400" />
//               Demo data · Not connected to live records
//             </div>
//           </div>

//           {notice && (
//             <div
//               role="status"
//               className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.07] px-4 py-3 text-sm text-amber-300"
//             >
//               <span>{notice}</span>
//               <button
//                 onClick={() => setNotice('')}
//                 className="shrink-0 text-amber-300/70 hover:text-amber-200"
//                 aria-label="Dismiss message"
//               >
//                 <X size={17} />
//               </button>
//             </div>
//           )}

//           {activeTab === 'overview' && renderOverview()}
//           {activeTab === 'users' && renderUsers()}
//           {activeTab === 'content' && renderContent()}
//           {activeTab === 'submissions' && renderSubmissions()}
//           {activeTab === 'reports' && renderReports()}
//           {activeTab === 'settings' && renderSettings()}

//           <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-white/[0.06] pt-5 text-xs text-slate-500 sm:flex-row">
//             <span>© {new Date().getFullYear()} AniGalnexo Admin Console</span>
//             <span className="flex items-center gap-1.5">
//               <ShieldCheck size={14} />
//               UI preview — secure access must be implemented separately
//             </span>
//           </footer>
//         </main>
//       </div>
//     </div>
//   );
// }

// function UserTable({
//   users,
//   onAction,
// }: {
//   users: typeof SAMPLE_USERS;
//   onAction?: (message: string) => void;
// }) {
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full min-w-[650px] text-left text-sm">
//         <thead>
//           <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-slate-500">
//             <th className="pb-4 pr-4 font-medium">User</th>
//             <th className="pb-4 pr-4 font-medium">Role</th>
//             <th className="pb-4 pr-4 font-medium">Status</th>
//             <th className="pb-4 pr-4 font-medium">Joined</th>
//             <th className="pb-4 text-right font-medium">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr
//               key={user.id}
//               className="border-b border-white/[0.05] last:border-0"
//             >
//               <td className="py-4 pr-4">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] font-semibold text-slate-300">
//                     {user.name.charAt(0)}
//                   </div>
//                   <div className="min-w-0">
//                     <p className="font-medium text-white">{user.name}</p>
//                     <p className="mt-1 text-xs text-slate-500">{user.email}</p>
//                   </div>
//                 </div>
//               </td>
//               <td className="py-4 pr-4">
//                 <span className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-xs text-slate-300">
//                   {user.role}
//                 </span>
//               </td>
//               <td className="py-4 pr-4"><StatusBadge status={user.status} /></td>
//               <td className="py-4 pr-4 text-xs text-slate-400">{user.joined}</td>
//               <td className="py-4 text-right">
//                 <button
//                   onClick={() =>
//                     onAction?.(`Account action requested for ${user.name}.`)
//                   }
//                   className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
//                   aria-label={`Account actions for ${user.name}`}
//                 >
//                   <MoreHorizontal size={18} />
//                 </button>
//               </td>
//             </tr>
//           ))}
//           {users.length === 0 && (
//             <tr>
//               <td colSpan={5} className="py-8">
//                 <EmptyNotice text="No matching accounts found." />
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }












import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  Bell,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  CircleUserRound,
  FileText,
  Flag,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
  AlertCircle,
  Film,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type Stats = {
  total_users: number;
  total_anime: number;
  published_anime: number;
  pending_anime: number;
  draft_anime: number;
};

type Section =
  | 'Overview'
  | 'Users & Creators'
  | 'Anime Management'
  | 'Submissions'
  | 'Reports'
  | 'Settings'
  | 'My Profile';

const navigation: {
  label: Section;
  icon: React.ElementType;
}[] = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Users & Creators', icon: Users },
    { label: 'Anime Management', icon: Clapperboard },
    { label: 'Submissions', icon: FileText },
    { label: 'Reports', icon: Flag },
    { label: 'Settings', icon: Settings },
    { label: 'My Profile', icon: CircleUserRound },
  ];

const numberFormat = (n: number) => n.toLocaleString();

export default function AdminDashboardView() {
  const [section, setSection] = useState<Section>('Overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('Administrator');
  const [updatedAt, setUpdatedAt] = useState('');

  const loadStats = useCallback(async (manual = false) => {
    if (!supabase) {
      setError('Supabase configuration is missing.');
      setStats(null);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (manual) setRefreshing(true);
    else setLoading(true);

    setError('');

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const authUser = sessionData.session?.user;

      if (!authUser) {
        throw new Error('Session expired. Sign in again.');
      }

      setEmail(authUser.email ?? '');
      setName(
        (authUser.user_metadata?.full_name as string) ||
        (authUser.user_metadata?.name as string) ||
        authUser.email?.split('@')[0] ||
        'Administrator'
      );

      // Verify that this account is registered as an administrator.
      const { data: admin, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (adminError) throw adminError;

      if (!admin) {
        throw new Error(
          'Admin access denied. This account is not registered in admin_users.'
        );
      }

      // Counts come from the secure Supabase SQL function.
      const { data, error: rpcError } = await supabase.rpc(
        'admin_dashboard_stats'
      );

      if (rpcError) throw rpcError;

      const result = Array.isArray(data) ? data[0] : data;

      if (!result || typeof result !== 'object') {
        throw new Error('The database returned no valid statistics.');
      }

      const raw = result as Record<string, unknown>;

      const readNumber = (key: keyof Stats): number => {
        const value = raw[key];
        const parsed = typeof value === 'number' ? value : Number(value);

        if (
          value === null ||
          value === undefined ||
          !Number.isFinite(parsed)
        ) {
          throw new Error(`Invalid database value: ${key}`);
        }

        return parsed;
      };

      setStats({
        total_users: readNumber('total_users'),
        total_anime: readNumber('total_anime'),
        published_anime: readNumber('published_anime'),
        pending_anime: readNumber('pending_anime'),
        draft_anime: readNumber('draft_anime'),
      });

      setUpdatedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setStats(null);
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load live database data.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();

    const onFocus = () => void loadStats(true);
    window.addEventListener('focus', onFocus);

    const channel = supabase
      ?.channel('anigalnexo-admin-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'anime' },
        () => void loadStats(true)
      )
      .subscribe();

    return () => {
      window.removeEventListener('focus', onFocus);
      if (channel && supabase) {
        void supabase.removeChannel(channel);
      }
    };
  }, [loadStats]);

  const signOut = async () => {
    if (!supabase) return;

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    window.location.reload();
  };

  const cards = [
    {
      label: 'Registered Users',
      value: stats?.total_users,
      detail: 'Accounts in Supabase Auth',
      icon: Users,
      color: 'text-orange-400',
      background: 'bg-orange-500/10',
    },
    {
      label: 'Total Anime',
      value: stats?.total_anime,
      detail: 'Records in anime database',
      icon: Film,
      color: 'text-violet-300',
      background: 'bg-violet-500/10',
    },
    {
      label: 'Published Anime',
      value: stats?.published_anime,
      detail: 'Published database records',
      icon: Clapperboard,
      color: 'text-emerald-300',
      background: 'bg-emerald-500/10',
    },
    {
      label: 'Pending Anime',
      value: stats?.pending_anime,
      detail: 'Awaiting review',
      icon: FileText,
      color: 'text-amber-300',
      background: 'bg-amber-500/10',
    },
  ];

  const visibleNavigation = navigation.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectSection = (next: Section) => {
    setSection(next);
    setMenuOpen(false);
    setProfileOpen(false);
    setSearch('');
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#101117] text-slate-200">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-white/[0.08] bg-[#191a22] transition-transform lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/[0.08] px-4">
          <button
            onClick={() => selectSection('Overview')}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Clapperboard size={22} />
            </span>
            <span>
              <span className="block text-lg font-extrabold text-white">
                Ani<span className="text-orange-400">Galnexo</span>
              </span>
              <span className="block text-[10px] tracking-[0.2em] text-slate-500">
                ADMIN CONSOLE
              </span>
            </span>
          </button>

          <button
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-2 text-slate-400 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-3 pt-6">
          <p className="px-3 pb-3 text-[10px] font-bold tracking-[0.2em] text-slate-500">
            WORKSPACE
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = section === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => selectSection(item.label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${active
                      ? 'border border-orange-500/20 bg-orange-500/10 font-semibold text-orange-400'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                    }`}
                >
                  <Icon size={18} />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight size={15} />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-3">
          <div className="rounded-xl border border-white/[0.08] bg-[#20212a] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-400">
              <ShieldCheck size={17} />
              Admin workspace
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Connected to your authenticated AniGalnexo account.
            </p>
          </div>

          <div className="mt-3 flex items-center gap-3 border-t border-white/[0.08] px-2 pt-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/15 font-bold text-orange-300">
              {name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {name}
              </p>
              <p className="truncate text-xs text-slate-500">
                Verified admin
              </p>
            </div>
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      {/* Top bar and page */}
      <div className="min-w-0 lg:pl-[250px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center gap-3 border-b border-white/[0.08] bg-[#101117]/95 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-xl border border-white/10 p-2 text-slate-300 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={19} />
          </button>

          <div className="relative hidden max-w-[480px] flex-1 sm:block">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search admin sections..."
              className="w-full rounded-full border border-white/10 bg-[#191a22] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-orange-500/50"
            />

            {search && (
              <div className="absolute left-0 right-0 top-12 rounded-xl border border-white/10 bg-[#191a22] p-2 shadow-xl">
                {visibleNavigation.length ? (
                  visibleNavigation.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => selectSection(item.label)}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5"
                    >
                      {item.label}
                    </button>
                  ))
                ) : (
                  <p className="p-3 text-sm text-slate-500">
                    No matching sections
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 sm:hidden" />

          <span className="hidden items-center gap-2 rounded-full border border-emerald-500/20 px-3 py-2 text-xs text-emerald-300 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Admin
          </span>

          <button
            onClick={() => void loadStats(true)}
            disabled={loading || refreshing}
            className="rounded-xl border border-white/10 p-2.5 text-slate-300 hover:bg-white/5 disabled:opacity-50"
            title="Refresh live data"
          >
            <RefreshCw
              size={17}
              className={refreshing ? 'animate-spin' : ''}
            />
          </button>

          <button
            onClick={() => selectSection('Reports')}
            className="relative rounded-xl border border-white/10 p-2.5 text-slate-300 hover:bg-white/5"
            title="Reports"
          >
            <Bell size={17} />
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen((open) => !open)}
              className="flex max-w-[180px] items-center gap-2 rounded-full border border-white/10 bg-[#191a22] py-1.5 pl-1.5 pr-3 hover:bg-white/5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-sm font-bold text-orange-300">
                {name.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden min-w-0 text-left sm:block">
                <span className="block max-w-[95px] truncate text-xs font-semibold text-white">
                  {name}
                </span>
                <span className="block text-[10px] text-slate-500">
                  Administrator
                </span>
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 z-50 w-60 rounded-xl border border-white/10 bg-[#1b1c25] p-2 shadow-xl">
                <div className="border-b border-white/10 px-3 py-2">
                  <p className="truncate text-sm font-semibold text-white">
                    {name}
                  </p>
                  <p className="truncate text-xs text-slate-500">{email}</p>
                </div>
                <button
                  onClick={() => selectSection('My Profile')}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-white/5"
                >
                  <CircleUserRound size={16} />
                  My Profile
                </button>
                <button
                  onClick={() => selectSection('Settings')}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-white/5"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  onClick={() => void signOut()}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-300 hover:bg-red-500/10"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 xl:p-8">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                <span>Admin</span>
                <ChevronRight size={13} />
                <span className="text-slate-300">{section}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {section}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                {section === 'Overview'
                  ? 'Live platform statistics from your database.'
                  : section === 'Users & Creators'
                    ? 'Registered accounts in Supabase Auth.'
                    : section === 'Anime Management'
                      ? 'Anime records stored in the database.'
                      : section === 'Submissions'
                        ? 'Submission management.'
                        : section === 'Reports'
                          ? 'Platform reports.'
                          : section === 'Settings'
                            ? 'Administrator settings.'
                            : 'Your signed-in account information.'}
              </p>
            </div>

            {updatedAt && (
              <p className="text-xs text-slate-500">
                Last updated: {updatedAt}
              </p>
            )}
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Live data unavailable</p>
                <p className="mt-1 break-words">{error}</p>
                <p className="mt-2 text-red-100/70">
                  Check the SQL function and your admin_users record.
                </p>
              </div>
            </div>
          )}

          {section === 'Overview' && (
            <>
              {loading && !stats ? (
                <div className="rounded-2xl border border-white/10 bg-[#191a22] p-6 text-sm text-slate-400">
                  Loading live database data…
                </div>
              ) : stats ? (
                <>
                  <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                    {cards.map((card) => {
                      const Icon = card.icon;
                      return (
                        <section
                          key={card.label}
                          className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#191a22] p-5 transition hover:border-white/15"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm text-slate-400">
                                {card.label}
                              </p>
                              <p className="mt-3 break-words text-3xl font-bold tracking-tight text-white">
                                {numberFormat(card.value!)}
                              </p>
                              <p className="mt-2 text-xs text-slate-500">
                                {card.detail}
                              </p>
                            </div>
                            <span
                              className={`rounded-xl p-3 ${card.background} ${card.color}`}
                            >
                              <Icon size={21} />
                            </span>
                          </div>
                        </section>
                      );
                    })}
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
                    <section className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#191a22] p-5 xl:col-span-2">
                      <div className="flex items-center gap-2">
                        <Activity size={18} className="text-orange-400" />
                        <h2 className="font-semibold text-white">
                          Platform activity
                        </h2>
                      </div>
                      <div className="mt-5 rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
                        <Activity
                          className="mx-auto text-slate-600"
                          size={26}
                        />
                        <p className="mt-3 text-sm font-medium text-slate-300">
                          No activity data yet
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Activity will appear when real events are recorded.
                        </p>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-white/[0.08] bg-[#191a22] p-5">
                      <h2 className="font-semibold text-white">
                        Anime status
                      </h2>
                      <div className="mt-4 space-y-3">
                        {[
                          ['Published', stats.published_anime],
                          ['Pending', stats.pending_anime],
                          ['Drafts', stats.draft_anime],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3"
                          >
                            <span className="text-sm text-slate-400">
                              {label}
                            </span>
                            <span className="font-semibold text-white">
                              {numberFormat(Number(value))}
                            </span>
                          </div>
                        ))}
                      </div>
                      {stats.total_anime === 0 && (
                        <p className="mt-4 text-xs leading-5 text-slate-500">
                          No anime records are stored in the database yet.
                          Existing hardcoded anime must be migrated before
                          this count includes the website catalogue.
                        </p>
                      )}
                    </section>
                  </div>
                </>
              ) : (
                !error && (
                  <p className="rounded-xl border border-white/10 p-5 text-sm text-slate-400">
                    No dashboard data available.
                  </p>
                )
              )}
            </>
          )}

          {section === 'Users & Creators' && (
            <section className="rounded-2xl border border-white/10 bg-[#191a22] p-6">
              <Users className="text-orange-400" size={25} />
              <h2 className="mt-3 text-lg font-semibold text-white">
                Registered users
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {stats
                  ? `${numberFormat(stats.total_users)} registered accounts.`
                  : 'Live user count is unavailable until the database query succeeds.'}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Private account details are not exposed in this summary.
              </p>
            </section>
          )}

          {section === 'Anime Management' && (
            <section className="rounded-2xl border border-white/10 bg-[#191a22] p-6">
              <Clapperboard className="text-orange-400" size={25} />
              <h2 className="mt-3 text-lg font-semibold text-white">
                Anime catalogue
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {stats
                  ? `${numberFormat(stats.total_anime)} anime database records.`
                  : 'Live anime count is unavailable until the database query succeeds.'}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Your existing hardcoded anime catalogue must be migrated into
                the database to be included in this count.
              </p>
            </section>
          )}

          {section === 'Submissions' && (
            <section className="rounded-2xl border border-white/10 bg-[#191a22] p-6">
              <FileText className="text-orange-400" size={25} />
              <h2 className="mt-3 text-lg font-semibold text-white">
                Submissions
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                No submissions table has been connected to this view yet.
              </p>
            </section>
          )}

          {section === 'Reports' && (
            <section className="rounded-2xl border border-white/10 bg-[#191a22] p-6">
              <Flag className="text-orange-400" size={25} />
              <h2 className="mt-3 text-lg font-semibold text-white">
                Reports
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                No reports table has been connected to this view yet.
              </p>
            </section>
          )}

          {section === 'Settings' && (
            <section className="rounded-2xl border border-white/10 bg-[#191a22] p-6">
              <Settings className="text-orange-400" size={25} />
              <h2 className="mt-3 text-lg font-semibold text-white">
                Admin settings
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Signed in as {email || 'your admin account'}.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Platform-wide settings are not saved because no settings
                table has been configured.
              </p>
            </section>
          )}

          {section === 'My Profile' && (
            <section className="rounded-2xl border border-white/10 bg-[#191a22] p-6">
              <CircleUserRound className="text-orange-400" size={28} />
              <h2 className="mt-3 text-lg font-semibold text-white">
                {name}
              </h2>
              <p className="mt-2 text-sm text-slate-400">{email}</p>
              <p className="mt-3 text-xs text-slate-500">
                Profile details come from your authenticated Supabase session.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
