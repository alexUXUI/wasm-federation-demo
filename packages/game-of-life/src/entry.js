window.addEventListener('DOMContentLoaded', function () {
    import('./index').then(function ({ render }) {
        return render()
    })
})