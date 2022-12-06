package com.bahanalinegroup;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.graphics.Color;
import android.os.CountDownTimer;
import android.widget.RemoteViews;
import android.content.SharedPreferences;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Implementation of App Widget functionality.
 */
public class ConnectionWidget extends AppWidgetProvider {
    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        try {
            SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
            String appString = sharedPref.getString("appData", "{\"text\":'Disconnected'}");
            JSONObject appData = new JSONObject(appString);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.connection_widget);
            String sendText = appData.getString("text");
            views.setTextViewText(R.id.appwidget_text, sendText);

            if (sendText.equalsIgnoreCase("Connected")) {
                views.setTextColor(R.id.appwidget_text, Color.GREEN);
                downConnection(context, appWidgetManager, appWidgetId);
            } else {
                views.setTextColor(R.id.appwidget_text, Color.RED);
            }

            appWidgetManager.updateAppWidget(appWidgetId, views);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    static void downConnection(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        long mMilliseconds = 10000;

        CountDownTimer mCountDownTimer = new CountDownTimer(mMilliseconds, 1000) {
            @Override
            public void onFinish() {
                RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.connection_widget);
                views.setTextViewText(R.id.appwidget_text, "Disconnected");
                views.setTextColor(R.id.appwidget_text, Color.RED);

                appWidgetManager.updateAppWidget(appWidgetId, views);
            }

            public void onTick(long millisUntilFinished) {
            }
        };

        mCountDownTimer.start();
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}