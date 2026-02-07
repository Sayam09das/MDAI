# TODO: Finance System Simplification

## Plan Summary
Simplify the finance system by:
1. Fix broken backend endpoints
2. Simplify admin finance dashboard to show teachers with courses and payment button
3. Create teacher finance dashboard to show earnings (starts at 0, increases as students enroll)
4. Remove complex transaction and reports pages

## Tasks Completed ✅

### Backend (admin.routes.js)
- [x] 1. Fix `/api/admin/finance/stats` endpoint - return correct finance stats
- [x] 2. Add `/api/admin/finance/teachers/courses` - List teachers with courses & prices
- [x] 3. Add `/api/admin/finance/pay-teacher` - Process payment to teacher
- [x] 4. Add `/api/admin/finance/payment-history` - View payment history

### Backend (teacher.routes.js)
- [x] 5. Add `/api/teacher/finance/overview` - Teacher earnings overview

### Admin Frontend
- [x] 6. Simplify FinanceOverview.jsx - Clean dashboard with stats
- [x] 7. Simplify TeacherPayments.jsx - Teachers with courses, student count, pay button
- [x] 8. Simplify ManageTransactions.jsx - Payment history only
- [x] 9. Simplify RevenueReports.jsx - Info page with links

### Client Frontend (Teacher)
- [x] 10. Create TeacherFinance.jsx - Teacher earnings dashboard showing:
    - Total earnings (starts at 0)
    - Pending earnings (increases as students enroll)
    - List of courses with student count
    - How the 90/10 split works

## Summary of Changes

### Admin Finance System
1. **Finance Overview** (`/admin/dashboard/finance`):
   - Shows total revenue, admin earnings (10%), teacher payments (90%)
   - Quick links to manage payments and view history

2. **Teacher Payments** (`/admin/dashboard/finance/payments`):
   - Lists all teachers with their courses
   - Shows each course with: course name, price, student count
   - Shows teacher's pending payment (90% of earnings)
   - "Pay" button to release payment to teacher
   - Expandable course details

3. **Payment History** (`/admin/dashboard/finance/transactions`):
   - Shows all payments made to teachers
   - Searchable by teacher name

### Teacher Finance Dashboard
1. **My Earnings** (`/teacher-dashboard/finance`):
   - Total earnings (90% of course sales)
   - Pending payment amount
   - Total paid out
   - List of courses with student count and earnings
   - Payment history
   - Explains the 90/10 revenue split

## How It Works
1. Student enrolls in a course and pays
2. 90% goes to teacher's pending earnings
3. Admin can view all pending payments
4. Admin clicks "Pay" to release funds to teacher
5. Teacher sees their earnings in their dashboard

## Notes
- All monetary values are calculated as 90% for teachers, 10% for platform
- Payments are tracked in the FinanceTransaction model
- The system automatically calculates earnings based on paid enrollments

