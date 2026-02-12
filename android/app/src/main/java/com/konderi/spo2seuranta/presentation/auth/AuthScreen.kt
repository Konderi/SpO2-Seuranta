package com.konderi.spo2seuranta.presentation.auth

import android.app.Activity
import android.util.Log
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.common.api.ApiException

private const val TAG = "AuthScreen"

@Composable
fun AuthScreen(
    authViewModel: AuthViewModel
) {
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        Log.d(TAG, "ActivityResult received: resultCode=${result.resultCode}, RESULT_OK=${Activity.RESULT_OK}, RESULT_CANCELED=${Activity.RESULT_CANCELED}")
        
        if (result.resultCode == Activity.RESULT_OK) {
            Log.d(TAG, "Result OK, getting signed in account from intent")
            val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
            try {
                val account = task.getResult(ApiException::class.java)
                Log.d(TAG, "Got account: ${account?.email}")
                authViewModel.handleSignInResult(account)
            } catch (e: ApiException) {
                Log.e(TAG, "ApiException getting account: statusCode=${e.statusCode}", e)
                authViewModel.handleSignInResult(null)
            }
        } else {
            Log.d(TAG, "Result not OK, result code: ${result.resultCode}")
            authViewModel.handleSignInResult(null)
        }
    }
    
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Default.Favorite,
                contentDescription = null,
                modifier = Modifier.size(120.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            
            Spacer(modifier = Modifier.height(32.dp))
            
            Text(
                text = "Hapetus",
                style = MaterialTheme.typography.displayMedium,
                color = MaterialTheme.colorScheme.primary,
                textAlign = TextAlign.Center
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = "Happisaturaation, sykkeen ja verenpaineen seuranta",
                style = MaterialTheme.typography.bodyLarge,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.onBackground
            )
            
            Spacer(modifier = Modifier.height(64.dp))
            
            Button(
                onClick = {
                    val signInIntent = authViewModel.getSignInClient().signInIntent
                    launcher.launch(signInIntent)
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(64.dp)
            ) {
                Text(
                    text = "Kirjaudu Google-tilillä",
                    style = MaterialTheme.typography.titleMedium
                )
            }
        }
    }
}
