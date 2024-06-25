
document.getElementById('joinroom').addEventListener('click', function() {
    const searchContainer = document.getElementById('searchContainer');
    const enterroom = document.getElementById('enterroom_container');
    if (searchContainer.classList.contains('hidden') && enterroom.classList.contains('hidden')) {
        searchContainer.classList.remove('hidden');
        enterroom.classList.remove('hidden');
        this.textContent = 'Join Room';
    } else {
        searchContainer.classList.add('hidden');
        enterroom.classList.add('hidden');
    }
});

document.getElementById('enterroom').addEventListener('click', function(e)
{
  const room_id = document.getElementById('searchBar').value;
  localStorage.setItem('room_id', room_id);

});