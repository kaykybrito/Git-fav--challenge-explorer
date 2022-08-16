import { GithubUser } from './GithubUser.js'

export class Gitfav {
  constructor(root) {
    this.root = document.querySelector(root)
    this.loadUsers()
  }

  loadUsers() {
    this.entries = JSON.parse(localStorage.getItem('@Github-fav:')) || []
  }

  save() {
    localStorage.setItem('@Github-fav:', JSON.stringify(this.entries))
  }
  async add(username) {
    try {
      const user = await GithubUser.search(username)

      const userExists = this.entries.find(entry => entry.login === user.login)

      if (userExists) {
        throw new Error('Usuário ja cadastrado!')
      }

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }
      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      entry => entry.login !== user.login
    )

    this.entries = filteredEntries

    this.update()
    this.save()
  }
}
export class GitfavView extends Gitfav {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onAdd()
    // this.createNoUser()
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button')

    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja remover?')

        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })

    if (this.entries.length === 0) {
      const trNoUser = this.createNoUser()
      this.tbody.append(trNoUser)
    }
  }

  createRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = `
    
    <td class="user">
      <img
        src=""
        alt="imagem de mayk brito"
      />
      <a href="https://github.com/diego3g">
        <p>Diego Fernandes</p>
        <span>/diego3g</span>
      </a>
    </td>
    <td class="repositories">123</td>
    <td class="followers">1234</td>
    <td>
      <button class="remove">Remover</button>
    </td>
  
    `
    return tr
  }

  createNoUser() {
    const noUser = document.createElement('tr')

    noUser.innerHTML = `
    <td>
      <div class="container">
        <img src="/image/star.svg" alt="imagem de uma estrelinha" />
        <span>Nenhum favorito ainda</span>
      </div>
    </td>
    `
    return noUser
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove()
    })
  }
}
