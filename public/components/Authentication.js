const Authentication = (function () {
	// This stores the current signed-in user
	let user = null
	let playerID = -1

	// This function gets the signed-in user
	const getUser = function () {
		return user
	}

	// This function updates the user id
	const setPlayerID = function (newID) {
		playerID = newID
	}

	// This function gets the user id
	const getPlayerID = function () {
		return playerID
	}

	// This function sends a sign-in request to the server
	// * `username`  - The username for the sign-in
	// * `password`  - The password of the user
	// * `onSuccess` - This is a callback function to be called when the
	//                 request is successful in this form `onSuccess()`
	// * `onError`   - This is a callback function to be called when the
	//                 request fails in this form `onError(error)`
	const signin = function (username, password, onSuccess, onError) {
		const data = JSON.stringify({ username, password })
		fetch('/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: data,
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.status == 'success') {
					user = json.user
					onSuccess()
				} else if (onError) {
					onError(json.error)
				}
			})
	}

	// This function sends a validate request to the server
	// * `onSuccess` - This is a callback function to be called when the
	//                 request is successful in this form `onSuccess()`
	// * `onError`   - This is a callback function to be called when the
	//                 request fails in this form `onError(error)`
	const validate = function (onSuccess, onError) {
		fetch('/validate')
			.then((res) => res.json())
			.then((json) => {
				if (json.status == 'success') {
					user = json.user
					onSuccess()
				} else if (onError) {
					onError(json.error)
				}
			})
	}

	// This function sends a sign-out request to the server
	// * `onSuccess` - This is a callback function to be called when the
	//                 request is successful in this form `onSuccess()`
	// * `onError`   - This is a callback function to be called when the
	//                 request fails in this form `onError(error)`
	const signout = function (onSuccess, onError) {
		fetch('/signout')
			.then((res) => res.json())
			.then((json) => {
				if (json.status == 'success') {
					user = null
					onSuccess()
				} else if (onError) {
					onError(json.error)
				}
			})
	}

	return { getUser, setPlayerID, getPlayerID, signin, validate, signout }
})()
