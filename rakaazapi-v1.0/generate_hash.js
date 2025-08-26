const bcrypt = require('bcryptjs');

const password = "Yaantrac@12345!";
const saltRounds = 10;

console.log('🔐 Generating bcrypt hash for password: "' + password + '"');
console.log('Salt rounds: ' + saltRounds);
console.log('');

// Generate hash
bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('❌ Error generating hash:', err);
        return;
    }
    
    console.log('✅ Hash generated successfully!');
    console.log('');
    console.log('📋 Hash for database:');
    console.log(hash);
    console.log('');
    console.log('📝 SQL INSERT statement:');
    console.log(`INSERT INTO tbl_users (name, email, username, password_hash, role_id, is_active) VALUES ('Admin User', 'admin@example.com', 'admin', '${hash}', 1, 1);`);
    console.log('');
    console.log('🔍 To verify the hash later, you can use:');
    console.log(`bcrypt.compare("${password}", "${hash}")`);
    
    // Verify the hash
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) {
            console.error('❌ Error verifying hash:', err);
            return;
        }
        
        console.log('');
        console.log('✅ Hash verification test:');
        console.log('Password matches hash:', isMatch);
    });
}); 