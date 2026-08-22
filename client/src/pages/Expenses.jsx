import { useState } from "react"

import ExpensesPage from "../components/ExpensesPage"

import AddExpenseForm from "../components/AddExpenseForm"


function Expenses() {

    const [showAddExpense, setShowAddExpense] = useState(false)


    return (

        <div>

            {showAddExpense ? (

                <AddExpenseForm
                    onCancel={() =>
                        setShowAddExpense(false)
                    }
                />

            ) : (

                <ExpensesPage
                    onAddExpense={() =>
                        setShowAddExpense(true)
                    }
                />

            )}

        </div>

    )

}

export default Expenses