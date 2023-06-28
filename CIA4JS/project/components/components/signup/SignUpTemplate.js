const SignUpTemplate =
    `
        <div class="signup-wrapper">
            <div class="img">
                <img src="https://raw.githubusercontent.com/thdtt/JCIA-Assets/d12e001221166702c24685a8ca0365b41f0e5bf8/bg.svg">
            </div>
            
            <form id="signup-form" class="needs-validation" novalidate>
              <img id="signup-avatar" src="https://raw.githubusercontent.com/thdtt/JCIA-Assets/d12e001221166702c24685a8ca0365b41f0e5bf8/avatar.svg" width="100" height="100">
              <h1 class="h3 mb-3 fw-normal">Sign up</h1>
              <div class="input-group has-validation mb-5">
                <span class="input-group-text">
                  <i class="fas fa-user"></i>
                </span>
                <div class="form-floating form-floating-group flex-grow-1">
                  <input type="text" class="form-control" id="username" placeholder="Username" required>
                  <label for="username">Username</label>
                </div>
                <div class="invalid-feedback"> Please provide username. </div>
              </div>
              
              <div class="input-group has-validation mb-5">
                <span class="input-group-text">
                  <i class="fas fa-envelope"></i>
                </span>
                <div class="form-floating form-floating-group flex-grow-1">
                  <input type="text" class="form-control" id="email" placeholder="Email" required>
                  <label for="email">Email</label>
                </div>
                <div class="invalid-feedback"> Please provide email. </div>
              </div>
              
              <div class="input-group has-validation mb-3">
                <span class="input-group-text">
                  <i class="fas fa-lock"></i>
                </span>
                <div class="form-floating form-floating-group flex-grow-1">
                  <input type="password" class="form-control" placeholder="Password" id="password" required>
                  <label for="password">Password</label>
                </div>
                <div class="invalid-feedback"> Please provide a password. </div>
              </div>
              <div class="mb-5" id="signup-alt"> Already had an account ? </div>
              <button class="w-100 btn btn-lg" id="signup-btn" type="submit">Sign up</button>
            </form>
        </div>
    `;

export default SignUpTemplate;