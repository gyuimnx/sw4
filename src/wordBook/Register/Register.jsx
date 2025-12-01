import React from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    return (
        <div className="auth-container">
            <h2>회원가입 (구현 예정)</h2>
            <div className="register-notice">
                <p>테스트 계정 (ID: user, PW: password)으로 로그인해주세요.</p>
            </div>
            <button className="BackToLoginBtn" onClick={() => navigate('/Login')}>로그인</button>
        </div>
    );
}

export default Register;