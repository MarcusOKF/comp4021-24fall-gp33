const Registration = (function () {
	// This function sends a register request to the server
	// * `username`  - The username for the sign-in
	// * `name`      - The name of the user
	// * `password`  - The password of the user
	// * `onSuccess` - This is a callback function to be called when the
	//                 request is successful in this form `onSuccess()`
	// * `onError`   - This is a callback function to be called when the
	//                 request fails in this form `onError(error)`
	const register = function (
		username,
		name,
		password,
		onSuccess,
		onError,
	) {
		const data = JSON.stringify({ username, name, password })

		fetch('/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: data,
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.status == 'success') {
					onSuccess()
				} else if (onError) {
					onError(json.error)
				}
			})
	}

	return { register }
})()
