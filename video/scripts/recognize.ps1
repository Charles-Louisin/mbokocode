# Reconnaissance vocale hors ligne (moteur français de Windows) : écrit chaque mot reconnu avec son
# instant de début et sa durée, en secondes depuis le début du fichier. Sert de points d'ancrage à
# scripts/align.mjs. Avec -vocab (un mot par ligne), le moteur ne choisit que parmi ces mots.
param([string]$wav, [string]$out, [string]$vocab = "")
Add-Type -AssemblyName System.Speech
$culture = New-Object System.Globalization.CultureInfo("fr-FR")
$engine = New-Object System.Speech.Recognition.SpeechRecognitionEngine($culture)
if ($vocab) {
  $words = [string[]](Get-Content $vocab -Encoding utf8 | Where-Object { $_ })
  $builder = New-Object System.Speech.Recognition.GrammarBuilder
  $builder.Culture = $culture
  $builder.Append((New-Object System.Speech.Recognition.Choices(, $words)), 1, 40)
  $engine.LoadGrammar((New-Object System.Speech.Recognition.Grammar($builder)))
} else {
  $engine.LoadGrammar((New-Object System.Speech.Recognition.DictationGrammar))
}
$engine.SetInputToWaveFile($wav)
$engine.EndSilenceTimeout = [TimeSpan]::FromMilliseconds(300)

# Reconnaissance continue : en mode Multiple, la position de chaque passage est comptée depuis le
# début du fichier (avec Recognize() en boucle, elle repart de zéro à chaque appel).
$recognized = Register-ObjectEvent $engine SpeechRecognized -SourceIdentifier rec
$done = Register-ObjectEvent $engine RecognizeCompleted -SourceIdentifier done
$engine.RecognizeAsync([System.Speech.Recognition.RecognizeMode]::Multiple)

$lines = New-Object System.Collections.Generic.List[string]
$inv = [System.Globalization.CultureInfo]::InvariantCulture
while ($true) {
  $event = Wait-Event -Timeout 5
  if ($null -eq $event) { continue }
  Remove-Event -EventIdentifier $event.EventIdentifier
  if ($event.SourceIdentifier -eq "done") { break }
  $result = $event.SourceEventArgs.Result
  $base = $result.Audio.AudioPosition.TotalSeconds
  foreach ($word in $result.Words) {
    $audio = $result.GetAudioForWordRange($word, $word)
    $start = $base + $audio.AudioPosition.TotalSeconds
    $lines.Add([string]::Format($inv, "{0:F3}`t{1:F3}`t{2}`t{3:F2}", $start, $audio.Duration.TotalSeconds, $word.Text, $word.Confidence))
  }
}
Unregister-Event rec
Unregister-Event done
[System.IO.File]::WriteAllLines($out, $lines, (New-Object System.Text.UTF8Encoding($false)))
"$($lines.Count) mots"
