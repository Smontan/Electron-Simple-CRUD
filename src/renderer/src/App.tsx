import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Modal } from './components'

interface User {
  id?: number | undefined
  firstname: string
  lastname: string
  birthdate: string
  email: string
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState<User>({
    firstname: '',
    lastname: '',
    birthdate: '',
    email: ''
  })
  const [editUser, setEditUser] = useState<User | null>(null)
  const loadUsers = async () => {
    const usersList = await window.api.fetchUsers()
    setUsers(usersList)
  }

  useEffect(() => {
    loadUsers()
    window.api.onCreateUserResponse(() => {
      loadUsers()
    })
    window.api.onUpdateUserResponse(() => {
      loadUsers()
      setEditUser(null)
    })
    window.api.onDeleteUserResponse(() => {
      loadUsers()
    })
  }, [])

  const handleCreateUser = () => {
    window.api.createUser(newUser)
    console.log(newUser)
    setNewUser({ firstname: '', lastname: '', birthdate: '', email: '' })
  }

  const handleEditUser = (user: User) => {
    setEditUser(user)
    setNewUser(user)
  }

  const handleUpdateUser = () => {
    if (editUser) {
      window.api.updateUser({ ...newUser, id: editUser.id! })
      setNewUser({ firstname: '', lastname: '', birthdate: '', email: '' })
    }
  }

  const handleDeleteUser = (id: number) => {
    window.api.deleteUser(id)
  }

  const createModalId = 'createModal'
  const updateModalId = 'updateModal'

  return (
    <>
      <div className="container d-flex flex-column  vh-100 px-0 ">
        <div className="navbar w-100 rounded mb-4 bg-body-tertiary ">
          <div className="container-fluid">
            <div className="navbar-brand">
              <span>Crud Operations</span>
            </div>
            <button
              className="btn d-inline-flex align-items-center gap-1 btn-primary "
              data-bs-toggle="modal"
              data-bs-target={`#${createModalId}`}
            >
              <Plus size={20} />
              <span className="fw-semibold fs-6">Add user</span>
            </button>
          </div>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Date</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.birthdate}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    data-bs-target={`#${updateModalId}`}
                    data-bs-toggle="modal"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>
                  <button className="btn btn-danger ms-2" onClick={() => handleDeleteUser(user.id!)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*  Create Modal */}
      <Modal id={createModalId} modalTitle="Create a user">
        <div className="modal-body">
          <div className="mb-3">
            <div className="form-label">Firstname</div>
            <input
              type="text"
              value={newUser.firstname}
              onChange={(e) => {
                setNewUser({ ...newUser, firstname: e.target.value })
              }}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <div className="form-label">Lastname</div>
            <input
              type="text"
              value={newUser.lastname}
              onChange={(e) => {
                setNewUser({ ...newUser, lastname: e.target.value })
              }}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <div className="form-label">Birthdate</div>
            <input
              type="date"
              value={newUser.birthdate}
              onChange={(e) => {
                setNewUser({ ...newUser, birthdate: e.target.value })
              }}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <div className="form-label">Email</div>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleCreateUser} data-bs-dismiss="modal">
            Save new user
          </button>
        </div>
      </Modal>

      {/*  Update Modal */}
      <Modal id={updateModalId} modalTitle="Update User ">
        <div className="modal-body">
          <div className="mb-3">
            <div className="form-label">Firstname</div>
            <input
              type="text"
              value={editUser ? newUser.firstname : ''}
              onChange={(e) => {
                setNewUser({ ...newUser, firstname: e.target.value })
              }}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <div className="form-label">Lastname</div>
            <input
              type="text"
              value={editUser ? newUser.lastname : ''}
              onChange={(e) => {
                setNewUser({ ...newUser, lastname: e.target.value })
              }}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <div className="form-label">Birthdate</div>
            <input
              type="date"
              value={editUser ? newUser.birthdate : ''}
              onChange={(e) => {
                setNewUser({ ...newUser, birthdate: e.target.value })
              }}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <div className="form-label">Email</div>
            <input
              type="email"
              value={editUser ? newUser.email : ''}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleUpdateUser}>
            Update user
          </button>
        </div>
      </Modal>
    </>
  )
}
export default App
