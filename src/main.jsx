import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store";
import "./index.css";
// import { createRoot } from "react-dom/client";
// import {
//   Hotel,
//   LayoutDashboard,
//   BedDouble,
//   CalendarCheck,
//   ReceiptText,
//   Users,
//   Wallet,
//   Brush,
//   ChartBar,
//   Settings,
//   Search,
//   Plus,
//   LogOut,
//   CheckCircle,
//   Clock,
//   IndianRupee,
// } from "lucide-react";
// import "./style.css";
// const rooms = [
//   {
//     no: "101",
//     type: "Deluxe",
//     price: 2500,
//     status: "available",
//     floor: "1st",
//     clean: "Clean",
//   },
//   {
//     no: "102",
//     type: "Deluxe",
//     price: 2500,
//     status: "occupied",
//     guest: "Arun Kumar",
//     floor: "1st",
//     clean: "Clean",
//   },
//   {
//     no: "201",
//     type: "Suite",
//     price: 4500,
//     status: "reserved",
//     guest: "Priya Sharma",
//     floor: "2nd",
//     clean: "Clean",
//   },
//   {
//     no: "202",
//     type: "Suite",
//     price: 4500,
//     status: "maintenance",
//     floor: "2nd",
//     clean: "Repair",
//   },
//   {
//     no: "301",
//     type: "Standard",
//     price: 1800,
//     status: "available",
//     floor: "3rd",
//     clean: "Clean",
//   },
//   {
//     no: "302",
//     type: "Standard",
//     price: 1800,
//     status: "occupied",
//     guest: "Mohammed Ali",
//     test:'123',
//     floor: "3rd",
//     clean: "Dirty",
//   },
// ];
// const bookings = [
//   {
//     id: "BK-0001",
//     guest: "Arun Kumar",
//     room: "102",
//     checkIn: "2026-07-01",
//     checkOut: "2026-07-03",
//     status: "Checked In",
//     amount: 5000,
//   },
//   {
//     id: "BK-0002",
//     guest: "Priya Sharma",
//     room: "201",
//     checkIn: "2026-07-02",
//     checkOut: "2026-07-04",
//     status: "Reserved",
//     amount: 9000,
//   },
//   {
//     id: "BK-0003",
//     guest: "Nisha Rao",
//     room: "301",
//     checkIn: "2026-07-05",
//     checkOut: "2026-07-06",
//     status: "Pending",
//     amount: 1800,
//   },
// ];
// const invoices = [
//   {
//     id: "INV-0001",
//     guest: "Arun Kumar",
//     room: "102",
//     total: 5600,
//     paid: 3000,
//     due: 2600,
//     status: "Partial",
//   },
//   {
//     id: "INV-0002",
//     guest: "Mohammed Ali",
//     room: "302",
//     total: 2200,
//     paid: 2200,
//     due: 0,
//     status: "Paid",
//   },
//   {
//     id: "INV-0003",
//     guest: "Priya Sharma",
//     room: "201",
//     total: 10080,
//     paid: 0,
//     due: 10080,
//     status: "Pending",
//   },
// ];
// const payments = [
//   {
//     id: "PAY-0001",
//     type: "Room Bill",
//     mode: "UPI",
//     guest: "Arun Kumar",
//     amount: 3000,
//     date: "2026-07-01",
//   },
//   {
//     id: "PAY-0002",
//     type: "Room Bill",
//     mode: "Cash",
//     guest: "Mohammed Ali",
//     amount: 2200,
//     date: "2026-07-01",
//   },
//   {
//     id: "PAY-0003",
//     type: "Advance",
//     mode: "Card",
//     guest: "Priya Sharma",
//     amount: 2000,
//     date: "2026-06-30",
//   },
// ];
// const guests = [
//   {
//     code: "G-001",
//     name: "Arun Kumar",
//     phone: "9876543210",
//     city: "Chennai",
//     visits: 3,
//     due: 2600,
//   },
//   {
//     code: "G-002",
//     name: "Priya Sharma",
//     phone: "9876501234",
//     city: "Coimbatore",
//     visits: 1,
//     due: 10080,
//   },
//   {
//     code: "G-003",
//     name: "Mohammed Ali",
//     phone: "9876512345",
//     city: "Madurai",
//     visits: 5,
//     due: 0,
//   },
// ];
// const menu = [
//   ["Dashboard", LayoutDashboard],
//   ["Room Status", BedDouble],
//   ["Bookings", CalendarCheck],
//   ["Billing", ReceiptText],
//   ["Guests", Users],
//   ["Payments", Wallet],
//   ["Housekeeping", Brush],
//   ["Reports", ChartBar],
//   ["Settings", Settings],
// ];
// function Card({ title, value, sub, icon: Icon }) {
//   return (
//     <div className="card">
//       <div>
//         <p>{title}</p>
//         <h2>{value}</h2>
//         <span>{sub}</span>
//       </div>
//       <div className="icon">
//         <Icon size={24} />
//       </div>
//     </div>
//   );
// }
// function Table({ cols, rows }) {
//   return (
//     <div className="tableWrap">
//       <table>
//         <thead>
//           <tr>
//             {cols.map((c) => (
//               <th key={c}>{c}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((r, i) => (
//             <tr key={i}>
//               {r.map((x, j) => (
//                 <td key={j}>{x}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
// function Status({ s }) {
//   return (
//     <span className={"badge " + s.toLowerCase().replaceAll(" ", "-")}>{s}</span>
//   );
// }
// function Dashboard() {
//   let total = invoices.reduce((a, b) => a + b.total, 0),
//     paid = invoices.reduce((a, b) => a + b.paid, 0);
//   return (
//     <>
//       <div className="hero">
//         <div>
//           <h1>Room Booking & Billing Dashboard</h1>
//           <p>
//             Static demo frontend connected to your backend workflow: booking,
//             check-in, invoices, payments and reports.
//           </p>
//         </div>
//         <button>
//           <Plus size={18} />
//           New Booking
//         </button>
//       </div>
//       <div className="grid">
//         <Card
//           title="Total Rooms"
//           value={rooms.length}
//           sub="3 available now"
//           icon={Hotel}
//         />
//         <Card
//           title="Today Revenue"
//           value={"₹" + paid.toLocaleString("en-IN")}
//           sub="Collected amount"
//           icon={IndianRupee}
//         />
//         <Card
//           title="Active Bookings"
//           value={bookings.length}
//           sub="Reserved + checked-in"
//           icon={CalendarCheck}
//         />
//         <Card
//           title="Pending Due"
//           value={"₹" + (total - paid).toLocaleString("en-IN")}
//           sub="Need collection"
//           icon={Clock}
//         />
//       </div>
//       <div className="two">
//         <section>
//           <h3>Recent Bookings</h3>
//           <Table
//             cols={["Booking", "Guest", "Room", "Status", "Amount"]}
//             rows={bookings.map((b) => [
//               b.id,
//               b.guest,
//               b.room,
//               <Status s={b.status} />,
//               `₹${b.amount}`,
//             ])}
//           />
//         </section>
//         <section>
//           <h3>Room Occupancy</h3>
//           <div className="chart">
//             <div style={{ height: "70%" }}></div>
//             <div style={{ height: "45%" }}></div>
//             <div style={{ height: "85%" }}></div>
//             <div style={{ height: "55%" }}></div>
//             <div style={{ height: "35%" }}></div>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// }
// function RoomStatus() {
//   return (
//     <>
//       <Header title="Room Status" btn="Add Room" />
//       <div className="roomGrid">
//         {rooms.map((r) => (
//           <div className={"room " + r.status} key={r.no}>
//             <div>
//               <h2>{r.no}</h2>
//               <p>
//                 {r.type} • {r.floor}
//               </p>
//               <span>{r.guest || "No guest"}</span>
//             </div>
//             <b>₹{r.price}</b>
//             <Status s={r.status} />
//             <small>Housekeeping: {r.clean}</small>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }
// function Bookings() {
//   return (
//     <>
//       <Header title="Bookings" btn="New Booking" />
//       <Table
//         cols={[
//           "Booking No",
//           "Guest",
//           "Room",
//           "Check In",
//           "Check Out",
//           "Status",
//           "Amount",
//         ]}
//         rows={bookings.map((b) => [
//           b.id,
//           b.guest,
//           b.room,
//           b.checkIn,
//           b.checkOut,
//           <Status s={b.status} />,
//           `₹${b.amount}`,
//         ])}
//       />
//     </>
//   );
// }
// function Billing() {
//   return (
//     <>
//       <Header title="Invoices & Billing" btn="Create Invoice" />
//       <Table
//         cols={["Invoice", "Guest", "Room", "Total", "Paid", "Due", "Status"]}
//         rows={invoices.map((i) => [
//           i.id,
//           i.guest,
//           i.room,
//           `₹${i.total}`,
//           `₹${i.paid}`,
//           `₹${i.due}`,
//           <Status s={i.status} />,
//         ])}
//       />
//     </>
//   );
// }
// function Guests() {
//   return (
//     <>
//       <Header title="Guests / Customers" btn="Add Guest" />
//       <Table
//         cols={["Code", "Name", "Phone", "City", "Visits", "Due"]}
//         rows={guests.map((g) => [
//           g.code,
//           g.name,
//           g.phone,
//           g.city,
//           g.visits,
//           `₹${g.due}`,
//         ])}
//       />
//     </>
//   );
// }
// function Payments() {
//   return (
//     <>
//       <Header title="Payments" btn="Add Payment" />
//       <Table
//         cols={["Payment No", "Type", "Mode", "Guest", "Amount", "Date"]}
//         rows={payments.map((p) => [
//           p.id,
//           p.type,
//           p.mode,
//           p.guest,
//           `₹${p.amount}`,
//           p.date,
//         ])}
//       />
//     </>
//   );
// }
// function Housekeeping() {
//   return (
//     <>
//       <Header title="Housekeeping" btn="Assign Task" />
//       <Table
//         cols={["Room", "Status", "Cleaning", "Action"]}
//         rows={rooms.map((r) => [
//           r.no,
//           <Status s={r.status} />,
//           r.clean,
//           r.clean === "Dirty" ? "Clean Now" : "View",
//         ])}
//       />
//     </>
//   );
// }
// function Reports() {
//   return (
//     <>
//       <Header title="Reports" btn="Export" />
//       <div className="grid">
//         <Card
//           title="Sales Report"
//           value="₹17,880"
//           sub="Room + services"
//           icon={ReceiptText}
//         />
//         <Card title="Occupancy" value="67%" sub="This week" icon={BedDouble} />
//         <Card title="Expense" value="₹4,250" sub="Monthly" icon={Wallet} />
//         <Card title="Profit" value="₹13,630" sub="Estimated" icon={ChartBar} />
//       </div>
//     </>
//   );
// }
// function SettingsPage() {
//   return (
//     <>
//       <Header title="Settings" btn="Save" />
//       <div className="settings">
//         <label>
//           Hotel Name
//           <input defaultValue="Mounttown Rooms" />
//         </label>
//         <label>
//           GST Number
//           <input defaultValue="33ABCDE1234F1Z5" />
//         </label>
//         <label>
//           Invoice Prefix
//           <input defaultValue="INV" />
//         </label>
//         <label>
//           Currency Symbol
//           <input defaultValue="₹" />
//         </label>
//       </div>
//     </>
//   );
// }
// function Header({ title, btn }) {
//   return (
//     <div className="topline">
//       <h1>{title}</h1>
//       <button>
//         <Plus size={17} />
//         {btn}
//       </button>
//     </div>
//   );
// }
// function App() {
//   const [page, setPage] = useState("Dashboard");
//   const Page = useMemo(
//     () =>
//       ({
//         Dashboard,
//         "Room Status": RoomStatus,
//         Bookings,
//         Billing,
//         Guests,
//         Payments,
//         Housekeeping,
//         Reports,
//         Settings: SettingsPage,
//       })[page],
//     [page],
//   );
//   return (
//     <div className="app">
//       <aside>
//         <div className="brand">
//           <Hotel />
//           <b>RoomBill Pro</b>
//         </div>
//         {menu.map(([m, Icon]) => (
//           <button
//             className={page === m ? "active" : ""}
//             onClick={() => setPage(m)}
//             key={m}
//           >
//             <Icon size={18} />
//             {m}
//           </button>
//         ))}
//         <button className="logout">
//           <LogOut size={18} />
//           Logout
//         </button>
//       </aside>
//       <main>
//         <div className="nav">
//           <div className="search">
//             <Search size={18} />
//             <input placeholder="Search booking, room, guest, invoice..." />
//           </div>
//           <div className="user">
//             <CheckCircle size={18} /> Admin
//           </div>
//         </div>
//         <Page />
//       </main>
//     </div>
//   );
// }
// createRoot(document.getElementById("root")).render(<App />);


ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);